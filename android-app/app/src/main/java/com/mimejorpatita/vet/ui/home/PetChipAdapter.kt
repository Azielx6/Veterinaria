package com.mimejorpatita.vet.ui.home

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.mimejorpatita.vet.data.local.entity.MascotaEntity
import com.mimejorpatita.vet.databinding.ItemPetChipBinding

class PetChipAdapter(
    private val onPetClick: (MascotaEntity) -> Unit
) : RecyclerView.Adapter<PetChipAdapter.PetViewHolder>() {

    private val items = mutableListOf<MascotaEntity>()

    fun submitList(pets: List<MascotaEntity>) {
        items.clear()
        items.addAll(pets)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PetViewHolder {
        val binding = ItemPetChipBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return PetViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PetViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class PetViewHolder(
        private val binding: ItemPetChipBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(pet: MascotaEntity) {
            binding.tvPetName.text = pet.name
            binding.tvPetBreed.text = pet.breed
            binding.tvPetMeta.text = "${pet.ageYears} años · ${pet.weightKg} kg"
            binding.root.setOnClickListener { onPetClick(pet) }
        }
    }
}
