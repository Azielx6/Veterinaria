package com.mimejorpatita.vet.ui.booking

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.mimejorpatita.vet.R
import com.mimejorpatita.vet.data.local.AppDatabase
import com.mimejorpatita.vet.data.local.SessionManager
import com.mimejorpatita.vet.data.local.entity.CitaEntity
import com.mimejorpatita.vet.data.local.entity.MascotaEntity
import com.mimejorpatita.vet.databinding.FragmentBookingBinding
import com.mimejorpatita.vet.ui.main.MainActivity
import com.mimejorpatita.vet.ui.pets.PetProfilesDialogFragment
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.Calendar
import java.util.Locale

class BookingFragment : Fragment() {

    private var _binding: FragmentBookingBinding? = null
    private val binding get() = _binding!!

    private lateinit var database: AppDatabase
    private lateinit var sessionManager: SessionManager
    private lateinit var petSelectAdapter: PetSelectAdapter

    private var petsList: List<MascotaEntity> = emptyList()
    private var selectedPetId: String? = null
    private var selectedServiceId: String = AppDatabase.SERVICE_BATH_ID
    private var selectedDateDb: String? = null // YYYY-MM-DD
    private var selectedTimeDb: String? = null // HH:mm

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.getString(ARG_SERVICE_ID)?.let { serviceId ->
            if (serviceId == AppDatabase.SERVICE_BATH_ID || serviceId == AppDatabase.SERVICE_MEDICAL_ID) {
                selectedServiceId = serviceId
            }
        }
        selectedPetId = arguments?.getString(ARG_PET_ID)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentBookingBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val context = requireContext()
        database = AppDatabase.getInstance(context)
        sessionManager = SessionManager(context)

        petSelectAdapter = PetSelectAdapter { pet ->
            selectedPetId = pet.id
            petSelectAdapter.setSelectedPetId(pet.id)
            updateSelectedPetMedicalInfo(pet)
            validateForm()
        }

        binding.rvPetSelect.apply {
            layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
            adapter = petSelectAdapter
        }

        binding.tvManagePets.setOnClickListener {
            PetProfilesDialogFragment
                .newInstance(openFormDirectly = false)
                .show(childFragmentManager, PetProfilesDialogFragment.TAG)
        }

        // Configurar servicio inicial (Baño o Cita Médica exclusivamente)
        if (selectedServiceId == AppDatabase.SERVICE_MEDICAL_ID) {
            binding.rbMedical.isChecked = true
        } else {
            binding.rbBath.isChecked = true
        }
        updateServiceUi()

        binding.rgService.setOnCheckedChangeListener { _, checkedId ->
            selectedServiceId = if (checkedId == R.id.rbMedical) {
                AppDatabase.SERVICE_MEDICAL_ID
            } else {
                AppDatabase.SERVICE_BATH_ID
            }
            updateServiceUi()
            validateForm()
        }

        binding.btnPickDate.setOnClickListener { showDatePicker() }
        binding.btnPickTime.setOnClickListener { showTimePicker() }
        binding.btnConfirmBooking.setOnClickListener { confirmBooking() }

        validateForm()

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                database.mascotaDao()
                    .observeByOwner(sessionManager.getUserId())
                    .collect { pets ->
                        petsList = pets
                        if (pets.isNotEmpty()) {
                            val currentStillExists = pets.any { it.id == selectedPetId }
                            if (!currentStillExists) {
                                selectedPetId = pets.first().id
                            }
                            petSelectAdapter.submitList(pets, selectedPetId)
                            pets.firstOrNull { it.id == selectedPetId }?.let {
                                updateSelectedPetMedicalInfo(it)
                            }
                        } else {
                            selectedPetId = null
                            petSelectAdapter.submitList(emptyList(), null)
                            binding.tvSelectedPetHistoryHeader.text = "Historial médico"
                            binding.tvSelectedPetHistory.text = "Agrega una mascota para reservar."
                            binding.tvSelectedPetAllergies.visibility = View.GONE
                        }
                        validateForm()
                    }
            }
        }
    }

    private fun updateSelectedPetMedicalInfo(pet: MascotaEntity) {
        binding.tvSelectedPetHistoryHeader.text = "Historial médico · ${pet.name}"
        val historyText = buildString {
            append(pet.medicalHistory.ifBlank { "Sin observaciones clínicas previas." })
            if (pet.chronicConditions.isNotBlank()) {
                append("\nCondiciones: ${pet.chronicConditions}")
            }
        }
        binding.tvSelectedPetHistory.text = historyText

        if (pet.allergies.isNotBlank()) {
            binding.tvSelectedPetAllergies.visibility = View.VISIBLE
            binding.tvSelectedPetAllergies.text = "Alergias: ${pet.allergies}"
        } else {
            binding.tvSelectedPetAllergies.visibility = View.GONE
        }
    }

    private fun updateServiceUi() {
        if (selectedServiceId == AppDatabase.SERVICE_MEDICAL_ID) {
            binding.rbMedical.setBackgroundResource(R.drawable.bg_selected_card)
            binding.rbBath.setBackgroundResource(R.drawable.bg_card_outlined)
            binding.tvEstimatedCost.text = "S/. 50.00"
        } else {
            binding.rbBath.setBackgroundResource(R.drawable.bg_selected_card)
            binding.rbMedical.setBackgroundResource(R.drawable.bg_card_outlined)
            binding.tvEstimatedCost.text = "S/. 45.00"
        }
    }

    private fun showDatePicker() {
        val now = Calendar.getInstance()
        val dialog = DatePickerDialog(
            requireContext(),
            { _, year, month, dayOfMonth ->
                val monthOneBased = month + 1
                selectedDateDb = String.format(Locale.US, "%04d-%02d-%02d", year, monthOneBased, dayOfMonth)
                val displayDate = String.format(Locale.US, "%02d/%02d/%04d", dayOfMonth, monthOneBased, year)
                binding.btnPickDate.text = displayDate
                validateForm()
            },
            now.get(Calendar.YEAR),
            now.get(Calendar.MONTH),
            now.get(Calendar.DAY_OF_MONTH)
        )
        // Bloquear fechas pasadas
        dialog.datePicker.minDate = System.currentTimeMillis() - 1000L
        dialog.show()
    }

    private fun showTimePicker() {
        val now = Calendar.getInstance()
        val defaultHour = 10
        val defaultMinute = 0

        TimePickerDialog(
            requireContext(),
            { _, hourOfDay, minute ->
                // Validar horario laboral (08:00 a 19:30)
                if (hourOfDay < 8 || hourOfDay > 19 || (hourOfDay == 19 && minute > 30)) {
                    Toast.makeText(
                        requireContext(),
                        "El horario de atención es de 08:00 a 19:30",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@TimePickerDialog
                }

                // Si eligió el día de hoy, evitar horas pasadas
                val todayDb = String.format(
                    Locale.US,
                    "%04d-%02d-%02d",
                    now.get(Calendar.YEAR),
                    now.get(Calendar.MONTH) + 1,
                    now.get(Calendar.DAY_OF_MONTH)
                )
                if (selectedDateDb == todayDb) {
                    val chosenMinutes = hourOfDay * 60 + minute
                    val currentMinutes = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)
                    if (chosenMinutes <= currentMinutes) {
                        Toast.makeText(
                            requireContext(),
                            "Elige una hora futura para hoy",
                            Toast.LENGTH_SHORT
                        ).show()
                        return@TimePickerDialog
                    }
                }

                val formattedTime = String.format(Locale.US, "%02d:%02d", hourOfDay, minute)
                selectedTimeDb = formattedTime
                binding.btnPickTime.text = formattedTime
                validateForm()
            },
            defaultHour,
            defaultMinute,
            true
        ).show()
    }

    private fun validateForm() {
        val enabled = selectedPetId != null &&
            selectedServiceId.isNotBlank() &&
            !selectedDateDb.isNullOrBlank() &&
            !selectedTimeDb.isNullOrBlank()

        binding.btnConfirmBooking.isEnabled = enabled
        binding.btnConfirmBooking.alpha = if (enabled) 1f else 0.5f
    }

    private fun confirmBooking() {
        val petId = selectedPetId ?: return
        val date = selectedDateDb ?: return
        val time = selectedTimeDb ?: return
        val notes = binding.etBookingNotes.text?.toString()?.trim().orEmpty()
        val userId = sessionManager.getUserId()

        val petName = petsList.firstOrNull { it.id == petId }?.name ?: "tu mascota"
        val serviceName = if (selectedServiceId == AppDatabase.SERVICE_MEDICAL_ID) {
            "Cita Médica"
        } else {
            "Baño"
        }

        binding.btnConfirmBooking.isEnabled = false

        viewLifecycleOwner.lifecycleScope.launch {
            withContext(Dispatchers.IO) {
                val cita = CitaEntity(
                    id = "cit_${System.currentTimeMillis()}",
                    userId = userId,
                    petId = petId,
                    serviceId = selectedServiceId,
                    date = date,
                    time = time,
                    status = "confirmed",
                    notes = notes,
                    createdAt = System.currentTimeMillis()
                )
                database.citaDao().insert(cita)
            }

            if (!isAdded) return@launch

            MaterialAlertDialogBuilder(requireContext())
                .setTitle("Cita confirmada")
                .setMessage(
                    "$serviceName para $petName registrada el ${binding.btnPickDate.text} a las $time."
                )
                .setPositiveButton("Ver mis citas") { _, _ ->
                    (activity as? MainActivity)?.openCalendar()
                }
                .setNegativeButton("Listo") { _, _ ->
                    selectedDateDb = null
                    selectedTimeDb = null
                    binding.btnPickDate.text = "Elegir fecha"
                    binding.btnPickTime.text = "Elegir hora"
                    binding.etBookingNotes.setText("")
                    validateForm()
                }
                .setCancelable(false)
                .show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    companion object {
        private const val ARG_SERVICE_ID = "arg_service_id"
        private const val ARG_PET_ID = "arg_pet_id"

        fun newInstance(serviceId: String? = null, petId: String? = null): BookingFragment {
            return BookingFragment().apply {
                arguments = Bundle().apply {
                    serviceId?.let { putString(ARG_SERVICE_ID, it) }
                    petId?.let { putString(ARG_PET_ID, it) }
                }
            }
        }
    }
}
