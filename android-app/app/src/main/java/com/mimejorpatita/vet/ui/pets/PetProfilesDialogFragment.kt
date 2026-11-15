package com.mimejorpatita.vet.ui.pets

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.mimejorpatita.vet.R
import com.mimejorpatita.vet.data.local.AppDatabase
import com.mimejorpatita.vet.data.local.SessionManager
import com.mimejorpatita.vet.data.local.entity.MascotaEntity
import com.mimejorpatita.vet.databinding.DialogPetFormBinding
import com.mimejorpatita.vet.databinding.DialogPetProfilesBinding
import com.mimejorpatita.vet.ui.main.MainActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PetProfilesDialogFragment : DialogFragment() {

    private var _binding: DialogPetProfilesBinding? = null
    private val binding get() = _binding!!

    private lateinit var database: AppDatabase
    private lateinit var sessionManager: SessionManager
    private lateinit var adapter: PetProfileAdapter
    private var openFormOnStart = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        openFormOnStart = arguments?.getBoolean(ARG_OPEN_FORM, false) == true
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = DialogPetProfilesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onStart() {
        super.onStart()
        dialog?.window?.setLayout(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val context = requireContext()
        database = AppDatabase.getInstance(context)
        sessionManager = SessionManager(context)

        adapter = PetProfileAdapter(
            onEditClick = { pet -> showPetFormDialog(pet) },
            onDeleteClick = { pet, totalPets -> confirmDeletePet(pet, totalPets) },
            onBookClick = { pet ->
                dismiss()
                (activity as? MainActivity)?.openBooking(petId = pet.id)
            }
        )

        binding.rvPetProfiles.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@PetProfilesDialogFragment.adapter
        }

        binding.btnNewPetProfile.setOnClickListener {
            showPetFormDialog(null)
        }

        binding.btnCloseDialog.setOnClickListener {
            dismiss()
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                database.mascotaDao()
                    .observeByOwner(sessionManager.getUserId())
                    .collect { pets ->
                        val items = withContext(Dispatchers.IO) {
                            pets.map { pet ->
                                val count = database.citaDao().countConfirmedByPet(pet.id)
                                PetProfileItem(pet = pet, appointmentCount = count)
                            }
                        }
                        adapter.submitList(items)
                    }
            }
        }

        if (openFormOnStart) {
            openFormOnStart = false
            showPetFormDialog(null)
        }
    }

    private fun confirmDeletePet(pet: MascotaEntity, totalPets: Int) {
        if (totalPets <= 1) {
            Toast.makeText(
                requireContext(),
                "Debes mantener al menos una mascota registrada.",
                Toast.LENGTH_SHORT
            ).show()
            return
        }

        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Eliminar perfil")
            .setMessage("¿Eliminar a ${pet.name} y sus citas asociadas?")
            .setNegativeButton("Cancelar", null)
            .setPositiveButton("Eliminar") { _, _ ->
                viewLifecycleOwner.lifecycleScope.launch {
                    withContext(Dispatchers.IO) {
                        database.mascotaDao().deleteById(pet.id)
                    }
                }
            }
            .show()
    }

    private fun showPetFormDialog(editingPet: MascotaEntity?) {
        val formBinding = DialogPetFormBinding.inflate(layoutInflater)

        if (editingPet != null) {
            formBinding.tvPetFormTitle.text = "Editar perfil · ${editingPet.name}"
            formBinding.etPetName.setText(editingPet.name)
            when (editingPet.species) {
                "Gato" -> formBinding.rbCat.isChecked = true
                "Otro" -> formBinding.rbOther.isChecked = true
                else -> formBinding.rbDog.isChecked = true
            }
            formBinding.etPetBreed.setText(editingPet.breed)
            formBinding.etPetAge.setText(editingPet.ageYears.toString())
            formBinding.etPetWeight.setText(editingPet.weightKg.toString())
            formBinding.etPetHistory.setText(editingPet.medicalHistory)
            formBinding.etPetAllergies.setText(editingPet.allergies)
            formBinding.etPetConditions.setText(editingPet.chronicConditions)
            formBinding.etPetVaccines.setText(editingPet.vaccines)
        } else {
            formBinding.tvPetFormTitle.text = "Nueva mascota"
        }

        val formDialog = MaterialAlertDialogBuilder(requireContext())
            .setView(formBinding.root)
            .create()

        formBinding.btnCancelPetForm.setOnClickListener {
            formDialog.dismiss()
        }

        formBinding.btnSavePetForm.setOnClickListener {
            val name = formBinding.etPetName.text?.toString()?.trim().orEmpty()
            val breed = formBinding.etPetBreed.text?.toString()?.trim().orEmpty()

            if (name.isEmpty()) {
                formBinding.etPetName.error = "Nombre requerido"
                return@setOnClickListener
            }
            if (breed.isEmpty()) {
                formBinding.etPetBreed.error = "Raza requerida"
                return@setOnClickListener
            }

            val species = when (formBinding.rgPetSpecies.checkedRadioButtonId) {
                R.id.rbCat -> "Gato"
                R.id.rbOther -> "Otro"
                else -> "Perro"
            }

            val ageYears = formBinding.etPetAge.text?.toString()?.toIntOrNull()?.coerceAtLeast(0) ?: 1
            val weightKg = formBinding.etPetWeight.text?.toString()?.toDoubleOrNull()?.coerceAtLeast(0.1) ?: 1.0
            val history = formBinding.etPetHistory.text?.toString()?.trim().orEmpty()
            val allergies = formBinding.etPetAllergies.text?.toString()?.trim().orEmpty()
            val conditions = formBinding.etPetConditions.text?.toString()?.trim().orEmpty()
            val vaccines = formBinding.etPetVaccines.text?.toString()?.trim().orEmpty()

            val petEntity = MascotaEntity(
                id = editingPet?.id ?: "pet_${System.currentTimeMillis()}",
                ownerId = editingPet?.ownerId ?: sessionManager.getUserId(),
                name = name,
                species = species,
                breed = breed,
                ageYears = ageYears,
                weightKg = weightKg,
                medicalHistory = history,
                allergies = allergies,
                chronicConditions = conditions,
                vaccines = vaccines
            )

            viewLifecycleOwner.lifecycleScope.launch {
                withContext(Dispatchers.IO) {
                    if (editingPet == null) {
                        database.mascotaDao().insert(petEntity)
                    } else {
                        database.mascotaDao().update(petEntity)
                    }
                }
                formDialog.dismiss()
            }
        }

        formDialog.show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    companion object {
        const val TAG = "PetProfilesDialogFragment"
        private const val ARG_OPEN_FORM = "arg_open_form"

        fun newInstance(openFormDirectly: Boolean): PetProfilesDialogFragment {
            return PetProfilesDialogFragment().apply {
                arguments = Bundle().apply {
                    putBoolean(ARG_OPEN_FORM, openFormDirectly)
                }
            }
        }
    }
}
