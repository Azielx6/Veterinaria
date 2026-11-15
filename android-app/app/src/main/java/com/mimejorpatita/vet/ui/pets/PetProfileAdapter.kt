package com.mimejorpatita.vet.ui.pets

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.mimejorpatita.vet.data.local.entity.MascotaEntity
import com.mimejorpatita.vet.databinding.ItemPetProfileBinding

data class PetProfileItem(
    val pet: MascotaEntity,
    val appointmentCount: Int
)

class PetProfileAdapter(
    private val onEditClick: (MascotaEntity) -> Unit,
    private val onDeleteClick: (MascotaEntity, Int) -> Unit,
    private val onBookClick: (MascotaEntity) -> Unit
) : RecyclerView.Adapter<PetProfileAdapter.ProfileViewHolder>() {

    private val items = mutableListOf<PetProfileItem>()

    fun submitList(newItems: List<PetProfileItem>) {
        items.clear()
        items.addAll(newItems)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProfileViewHolder {
        val binding = ItemPetProfileBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ProfileViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProfileViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class ProfileViewHolder(
        private val binding: ItemPetProfileBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: PetProfileItem) {
            val pet = item.pet
            binding.tvProfileName.text = pet.name
            binding.tvProfileDetails.text = "${pet.species} · ${pet.breed} · ${pet.ageYears} años · ${pet.weightKg} kg"

            val historyText = buildString {
                append("Historial: ")
                append(pet.medicalHistory.ifBlank { "Sin observaciones previas." })
                if (pet.chronicConditions.isNotBlank()) {
                    append("\nCondiciones: ${pet.chronicConditions}")
                }
            }
            binding.tvProfileHistory.text = historyText

            if (pet.allergies.isNotBlank()) {
                binding.tvProfileAllergies.visibility = View.VISIBLE
                binding.tvProfileAllergies.text = "Alergias: ${pet.allergies}"
            } else {
                binding.tvProfileAllergies.visibility = View.GONE
            }

            binding.tvProfileVaccines.text = if (pet.vaccines.isNotBlank()) {
                "Vacunas: ${pet.vaccines}"
            } else {
                "Vacunas: Sin registro"
            }

            binding.tvProfileAppointmentsCount.text = if (item.appointmentCount == 1) {
                "1 cita activa"
            } else {
                "${item.appointmentCount} citas activas"
            }

            binding.btnEditPet.setOnClickListener { onEditClick(pet) }
            binding.btnDeletePet.setOnClickListener { onDeleteClick(pet, items.size) }
            binding.btnBookForPet.setOnClickListener { onBookClick(pet) }
        }
    }
}
