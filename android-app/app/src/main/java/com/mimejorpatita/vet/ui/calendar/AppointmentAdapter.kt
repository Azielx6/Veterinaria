package com.mimejorpatita.vet.ui.calendar

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.mimejorpatita.vet.R
import com.mimejorpatita.vet.data.local.dao.CitaConDetalle
import com.mimejorpatita.vet.databinding.ItemAppointmentBinding
import java.util.Locale

class AppointmentAdapter(
    private val onCancelClick: (CitaConDetalle) -> Unit
) : RecyclerView.Adapter<AppointmentAdapter.AppointmentViewHolder>() {

    private val items = mutableListOf<CitaConDetalle>()

    fun submitList(appointments: List<CitaConDetalle>) {
        items.clear()
        items.addAll(appointments)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AppointmentViewHolder {
        val binding = ItemAppointmentBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return AppointmentViewHolder(binding)
    }

    override fun onBindViewHolder(holder: AppointmentViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class AppointmentViewHolder(
        private val binding: ItemAppointmentBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: CitaConDetalle) {
            binding.tvServiceName.text = item.serviceName
            binding.tvPetName.text = "${item.petName} · ${item.petBreed}"
            binding.tvServicePrice.text = String.format(Locale.US, "S/. %.2f", item.servicePrice)
            binding.tvDate.text = formatDateForDisplay(item.date)
            binding.tvTime.text = item.time

            binding.ivServiceIcon.setImageResource(
                if (item.serviceCategory == "bath") R.drawable.ic_bath else R.drawable.ic_medical
            )

            if (item.notes.isNotBlank()) {
                binding.tvNotes.visibility = View.VISIBLE
                binding.tvNotes.text = "Nota: ${item.notes}"
            } else {
                binding.tvNotes.visibility = View.GONE
            }

            binding.btnCancelAppointment.setOnClickListener {
                onCancelClick(item)
            }
        }

        private fun formatDateForDisplay(dbDate: String): String {
            val parts = dbDate.split("-")
            return if (parts.size == 3) {
                "${parts[2]}/${parts[1]}/${parts[0]}"
            } else {
                dbDate
            }
        }
    }
}
