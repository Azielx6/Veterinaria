package com.mimejorpatita.vet.ui.main

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.mimejorpatita.vet.R
import com.mimejorpatita.vet.data.local.AppDatabase
import com.mimejorpatita.vet.data.local.SessionManager
import com.mimejorpatita.vet.databinding.ActivityMainBinding
import com.mimejorpatita.vet.ui.booking.BookingFragment
import com.mimejorpatita.vet.ui.calendar.CalendarFragment
import com.mimejorpatita.vet.ui.home.HomeFragment
import com.mimejorpatita.vet.ui.login.LoginActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var sessionManager: SessionManager
    private var isProgrammaticSelection = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        sessionManager = SessionManager(this)
        if (!sessionManager.isLoggedIn()) {
            redirectToLogin()
            return
        }

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.tvUserName.text = sessionManager.getUserName()

        // Garantizar inicialización de base de datos local
        val db = AppDatabase.getInstance(applicationContext)
        lifecycleScope.launch(Dispatchers.IO) {
            AppDatabase.seedIfEmpty(db)
            val userId = sessionManager.getUserId()
            if (userId.isNotEmpty()) {
                AppDatabase.ensureDefaultPetsForUser(db, userId)
            }
        }

        binding.btnLogout.setOnClickListener {
            MaterialAlertDialogBuilder(this)
                .setTitle("Cerrar sesión")
                .setMessage("¿Deseas salir de tu cuenta en este dispositivo?")
                .setNegativeButton("Cancelar", null)
                .setPositiveButton("Salir") { _, _ ->
                    sessionManager.clearSession()
                    redirectToLogin()
                }
                .show()
        }

        binding.bottomNavigation.setOnItemSelectedListener { item ->
            if (isProgrammaticSelection) return@setOnItemSelectedListener true
            when (item.itemId) {
                R.id.nav_home -> {
                    switchFragment(HomeFragment())
                    true
                }

                R.id.nav_booking -> {
                    switchFragment(BookingFragment.newInstance())
                    true
                }

                R.id.nav_calendar -> {
                    switchFragment(CalendarFragment())
                    true
                }

                else -> false
            }
        }

        if (savedInstanceState == null) {
            switchFragment(HomeFragment())
        }
    }

    fun openBooking(serviceId: String? = null, petId: String? = null) {
        isProgrammaticSelection = true
        binding.bottomNavigation.selectedItemId = R.id.nav_booking
        isProgrammaticSelection = false
        switchFragment(BookingFragment.newInstance(serviceId, petId))
    }

    fun openCalendar() {
        isProgrammaticSelection = true
        binding.bottomNavigation.selectedItemId = R.id.nav_calendar
        isProgrammaticSelection = false
        switchFragment(CalendarFragment())
    }

    private fun switchFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }

    private fun redirectToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}
