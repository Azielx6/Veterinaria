package com.mimejorpatita.vet.ui.home

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.LinearLayoutManager
import com.mimejorpatita.vet.R
import com.mimejorpatita.vet.data.local.AppDatabase
import com.mimejorpatita.vet.data.local.SessionManager
import com.mimejorpatita.vet.databinding.FragmentHomeBinding
import com.mimejorpatita.vet.ui.main.MainActivity
import com.mimejorpatita.vet.ui.pets.PetProfilesDialogFragment
import kotlinx.coroutines.launch

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private lateinit var petChipAdapter: PetChipAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val context = requireContext()
        val sessionManager = SessionManager(context)
        val database = AppDatabase.getInstance(context)

        petChipAdapter = PetChipAdapter {
            openPetProfiles(openFormDirectly = false)
        }

        binding.rvPetsHome.apply {
            layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
            adapter = petChipAdapter
        }

        binding.btnQuickBook.setOnClickListener {
            (activity as? MainActivity)?.openBooking()
        }

        binding.btnCallClinic.setOnClickListener {
            val phone = getString(R.string.clinic_phone)
            val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))
            startActivity(dialIntent)
        }

        binding.tvViewPetProfiles.setOnClickListener {
            openPetProfiles(openFormDirectly = false)
        }

        binding.btnAddPet.setOnClickListener {
            openPetProfiles(openFormDirectly = true)
        }

        binding.cardServiceBath.setOnClickListener {
            (activity as? MainActivity)?.openBooking(serviceId = AppDatabase.SERVICE_BATH_ID)
        }

        binding.btnBookBath.setOnClickListener {
            (activity as? MainActivity)?.openBooking(serviceId = AppDatabase.SERVICE_BATH_ID)
        }

        binding.cardServiceMedical.setOnClickListener {
            (activity as? MainActivity)?.openBooking(serviceId = AppDatabase.SERVICE_MEDICAL_ID)
        }

        binding.btnBookMedical.setOnClickListener {
            (activity as? MainActivity)?.openBooking(serviceId = AppDatabase.SERVICE_MEDICAL_ID)
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                database.mascotaDao()
                    .observeByOwner(sessionManager.getUserId())
                    .collect { pets ->
                        petChipAdapter.submitList(pets)
                        binding.tvPetsHeader.text = "Mis mascotas (${pets.size})"
                    }
            }
        }
    }

    private fun openPetProfiles(openFormDirectly: Boolean) {
        PetProfilesDialogFragment
            .newInstance(openFormDirectly)
            .show(childFragmentManager, PetProfilesDialogFragment.TAG)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
