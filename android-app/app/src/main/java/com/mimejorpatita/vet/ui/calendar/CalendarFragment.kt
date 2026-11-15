package com.mimejorpatita.vet.ui.calendar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.mimejorpatita.vet.R
import com.mimejorpatita.vet.data.local.AppDatabase
import com.mimejorpatita.vet.data.local.SessionManager
import com.mimejorpatita.vet.data.local.dao.CitaConDetalle
import com.mimejorpatita.vet.databinding.FragmentCalendarBinding
import com.mimejorpatita.vet.ui.main.MainActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.Locale

class CalendarFragment : Fragment() {

    private var _binding: FragmentCalendarBinding? = null
    private val binding get() = _binding!!

    private lateinit var database: AppDatabase
    private lateinit var sessionManager: SessionManager
    private lateinit var appointmentAdapter: AppointmentAdapter

    private var allAppointments: List<CitaConDetalle> = emptyList()
    private var selectedDateFilter: String? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCalendarBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val context = requireContext()
        database = AppDatabase.getInstance(context)
        sessionManager = SessionManager(context)

        appointmentAdapter = AppointmentAdapter { appointment ->
            confirmCancelAppointment(appointment)
        }

        binding.rvAppointments.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = appointmentAdapter
        }

        binding.btnNewBooking.setOnClickListener {
            (activity as? MainActivity)?.openBooking()
        }

        binding.btnEmptyBook.setOnClickListener {
            (activity as? MainActivity)?.openBooking()
        }

        binding.calendarView.setOnDateChangeListener { _, year, month, dayOfMonth ->
            val monthOneBased = month + 1
            selectedDateFilter = String.format(Locale.US, "%04d-%02d-%02d", year, monthOneBased, dayOfMonth)
            val displayDate = String.format(Locale.US, "%02d/%02d/%04d", dayOfMonth, monthOneBased, year)
            binding.layoutFilterBar.visibility = View.VISIBLE
            binding.tvFilterLabel.text = "Citas del $displayDate"
            renderAppointments()
        }

        binding.tvClearFilter.setOnClickListener {
            selectedDateFilter = null
            binding.layoutFilterBar.visibility = View.GONE
            renderAppointments()
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                database.citaDao()
                    .observeConfirmedByUser(sessionManager.getUserId())
                    .collect { list ->
                        allAppointments = list
                        renderAppointments()
                    }
            }
        }
    }

    private fun renderAppointments() {
        val filtered = if (selectedDateFilter == null) {
            allAppointments
        } else {
            allAppointments.filter { it.date == selectedDateFilter }
        }

        binding.tvAppointmentsCount.text = filtered.size.toString()

        if (filtered.isEmpty()) {
            binding.rvAppointments.visibility = View.GONE
            binding.layoutEmptyState.visibility = View.VISIBLE

            if (selectedDateFilter == null) {
                binding.tvEmptyTitle.text = getString(R.string.empty_appointments)
                binding.tvEmptySubtitle.text = "Reserva un baño o cita médica cuando lo necesites."
            } else {
                binding.tvEmptyTitle.text = "Sin citas para la fecha seleccionada"
                binding.tvEmptySubtitle.text = "Toca \"Ver todas\" o agenda una cita para este día."
            }
        } else {
            binding.rvAppointments.visibility = View.VISIBLE
            binding.layoutEmptyState.visibility = View.GONE
            appointmentAdapter.submitList(filtered)
        }
    }

    private fun confirmCancelAppointment(appointment: CitaConDetalle) {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Cancelar cita")
            .setMessage("¿Deseas cancelar la cita de ${appointment.serviceName} para ${appointment.petName}?")
            .setNegativeButton("Mantener", null)
            .setPositiveButton("Sí, cancelar") { _, _ ->
                viewLifecycleOwner.lifecycleScope.launch {
                    withContext(Dispatchers.IO) {
                        database.citaDao().cancelById(appointment.id)
                    }
                }
            }
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
