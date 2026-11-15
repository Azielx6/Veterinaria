package com.mimejorpatita.vet.ui.login

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.doAfterTextChanged
import androidx.lifecycle.lifecycleScope
import com.mimejorpatita.vet.data.local.AppDatabase
import com.mimejorpatita.vet.data.local.SessionManager
import com.mimejorpatita.vet.data.local.entity.UsuarioEntity
import com.mimejorpatita.vet.databinding.ActivityLoginBinding
import com.mimejorpatita.vet.ui.main.MainActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var sessionManager: SessionManager
    private lateinit var database: AppDatabase

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        sessionManager = SessionManager(this)
        if (sessionManager.isLoggedIn()) {
            navigateToMain()
            return
        }

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        database = AppDatabase.getInstance(applicationContext)

        // Precargar datos locales iniciales si la base SQLite está vacía
        lifecycleScope.launch(Dispatchers.IO) {
            AppDatabase.seedIfEmpty(database)
        }

        binding.etEmail.doAfterTextChanged {
            binding.tilEmail.error = null
        }
        binding.etPassword.doAfterTextChanged {
            binding.tilPassword.error = null
        }

        binding.tvDemoAutofill.setOnClickListener {
            binding.etEmail.setText("tutor@ejemplo.com")
            binding.etPassword.setText("clave123")
            binding.tilEmail.error = null
            binding.tilPassword.error = null
        }

        binding.btnLogin.setOnClickListener {
            attemptLogin()
        }
    }

    private fun attemptLogin() {
        val email = binding.etEmail.text?.toString()?.trim().orEmpty()
        val password = binding.etPassword.text?.toString().orEmpty()

        var valid = true
        if (email.isEmpty()) {
            binding.tilEmail.error = "Ingresa tu correo electrónico"
            valid = false
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilEmail.error = "Formato de correo inválido"
            valid = false
        }

        if (password.isEmpty()) {
            binding.tilPassword.error = "Ingresa tu contraseña"
            valid = false
        } else if (password.length < 4) {
            binding.tilPassword.error = "Mínimo 4 caracteres"
            valid = false
        }

        if (!valid) return

        binding.btnLogin.isEnabled = false

        lifecycleScope.launch {
            val result = withContext(Dispatchers.IO) {
                AppDatabase.seedIfEmpty(database)
                val existingUser = database.usuarioDao().getByEmail(email)
                if (existingUser != null) {
                    if (existingUser.passwordHash == password) {
                        AppDatabase.ensureDefaultPetsForUser(database, existingUser.id)
                        LoginResult.Success(existingUser)
                    } else {
                        LoginResult.WrongPassword
                    }
                } else {
                    // Registro automático local sin servidor para nuevos correos
                    val rawName = email.substringBefore("@")
                        .replace(".", " ")
                        .replace("_", " ")
                        .split(" ")
                        .filter { it.isNotBlank() }
                        .joinToString(" ") { part ->
                            part.replaceFirstChar { ch -> ch.uppercase() }
                        }
                        .ifBlank { "Tutor" }

                    val newUser = UsuarioEntity(
                        id = "usr_${System.currentTimeMillis()}",
                        name = rawName,
                        email = email.lowercase(),
                        passwordHash = password,
                        phone = ""
                    )
                    database.usuarioDao().insert(newUser)
                    AppDatabase.ensureDefaultPetsForUser(database, newUser.id)
                    LoginResult.Success(newUser)
                }
            }

            binding.btnLogin.isEnabled = true

            when (result) {
                is LoginResult.Success -> {
                    sessionManager.saveSession(
                        userId = result.user.id,
                        name = result.user.name,
                        email = result.user.email
                    )
                    navigateToMain()
                }

                LoginResult.WrongPassword -> {
                    binding.tilPassword.error = "Contraseña incorrecta"
                }
            }
        }
    }

    private fun navigateToMain() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }

    private sealed class LoginResult {
        data class Success(val user: UsuarioEntity) : LoginResult()
        data object WrongPassword : LoginResult()
    }
}
