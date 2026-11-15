package com.mimejorpatita.vet.ui.booking

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.mimejorpatita.vet.R
import com.mimejorpatita.vet.data.local.entity.MascotaEntity
import com.mimejorpatita.vet.databinding.ItemPetSelectBinding

class PetSelectAdapter(
    private val onPetSelected: (MascotaEntity) -> Unit
) : RecyclerView.Adapter<PetSelectAdapter.SelectViewHolder>() {

    private val items = mutableListOf<MascotaEntity>()
    private var selectedPetId: String? = null

    fun submitList(pets: List<MascotaEntity>, selectedId: String?) {
        items.clear()
        items.addAll(pets)
        selectedPetId = selectedId
        notifyDataSetChanged()
    }

    fun setSelectedPetId(petId: String) {
        selectedPetId = petId
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SelectViewHolder {
        val binding = ItemPetSelectBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return SelectViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SelectViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class SelectViewHolder(
        private val binding: ItemPetSelectBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(pet: MascotaEntity) {
            val isSelected = pet.id == selectedPetId
            val ctx = binding.root.context

            binding.tvPetSelectName.text = pet.name
            binding.tvPetSelectBreed.text = pet.breed

            binding.petSelectContainer.setBackgroundResource(
                if (isSelected) R.drawable.bg_selected_card else R.drawable.bg_card_outlined
            )

            val tintColor = ContextCompat.getColor(
                ctx,
                if (isSelected) R.color.teal_primary else R.color.text_secondary
            )
            binding.ivPetSelectIcon.setColorFilter(tintColor)

            binding.root.setOnClickListener {
                onPetSelected(pet)
            }
        }
    }
}
