package com.mimejorpatita.vet.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.mimejorpatita.vet.data.local.dao.CitaDao
import com.mimejorpatita.vet.data.local.dao.MascotaDao
import com.mimejorpatita.vet.data.local.dao.ServicioDao
import com.mimejorpatita.vet.data.local.dao.UsuarioDao
import com.mimejorpatita.vet.data.local.entity.CitaEntity
import com.mimejorpatita.vet.data.local.entity.MascotaEntity
import com.mimejorpatita.vet.data.local.entity.ServicioEntity
import com.mimejorpatita.vet.data.local.entity.UsuarioEntity
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

@Database(
    entities = [
        UsuarioEntity::class,
        MascotaEntity::class,
        ServicioEntity::class,
        CitaEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun usuarioDao(): UsuarioDao
    abstract fun mascotaDao(): MascotaDao
    abstract fun servicioDao(): ServicioDao
    abstract fun citaDao(): CitaDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        private val seedMutex = Mutex()

        const val DEMO_USER_ID = "usr_001"
        const val SERVICE_BATH_ID = "srv_bath"
        const val SERVICE_MEDICAL_ID = "srv_medical"

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "mi_mejor_patita.db"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { INSTANCE = it }
            }
        }

        suspend fun seedIfEmpty(db: AppDatabase) {
            seedMutex.withLock {
                // 1. Usuario demo inicial
                if (db.usuarioDao().count() == 0) {
                    db.usuarioDao().insert(
                        UsuarioEntity(
                            id = DEMO_USER_ID,
                            name = "Carolina Méndez",
                            email = "tutor@ejemplo.com",
                            passwordHash = "clave123",
                            phone = "+51 987 654 321"
                        )
                    )
                }

                // 2. Servicios exclusivos: Baño y Cita Médica
                if (db.servicioDao().count() == 0) {
                    db.servicioDao().insertAll(
                        listOf(
                            ServicioEntity(
                                id = SERVICE_BATH_ID,
                                name = "Baño",
                                category = "bath",
                                description = "Higiene completa con shampoo hipoalergénico, secado y cepillado",
                                durationMinutes = 45,
                                price = 45.00
                            ),
                            ServicioEntity(
                                id = SERVICE_MEDICAL_ID,
                                name = "Cita Médica",
                                category = "medical",
                                description = "Evaluación física integral, auscultación y diagnóstico preventivo",
                                durationMinutes = 30,
                                price = 50.00
                            )
                        )
                    )
                }

                // 3. Mascotas iniciales del usuario demo
                if (db.mascotaDao().countByOwner(DEMO_USER_ID) == 0) {
                    db.mascotaDao().insertAll(
                        listOf(
                            MascotaEntity(
                                id = "pet_001",
                                ownerId = DEMO_USER_ID,
                                name = "Luna",
                                species = "Perro",
                                breed = "Caniche Toy",
                                ageYears = 3,
                                weightKg = 4.2,
                                medicalHistory = "Esterilizada en 2024. Último control preventivo sin observaciones.",
                                allergies = "Sensibilidad leve al pollo",
                                chronicConditions = "",
                                vaccines = "Rabia, Sextuple"
                            ),
                            MascotaEntity(
                                id = "pet_002",
                                ownerId = DEMO_USER_ID,
                                name = "Rocky",
                                species = "Perro",
                                breed = "Golden Retriever",
                                ageYears = 4,
                                weightKg = 29.5,
                                medicalHistory = "Buen estado general. Control articular preventivo cada 6 meses.",
                                allergies = "",
                                chronicConditions = "Tendencia leve a dermatitis estacional",
                                vaccines = "Rabia, Sextuple, Bordetella"
                            ),
                            MascotaEntity(
                                id = "pet_003",
                                ownerId = DEMO_USER_ID,
                                name = "Milo",
                                species = "Gato",
                                breed = "Siamés",
                                ageYears = 2,
                                weightKg = 4.1,
                                medicalHistory = "Castrado en 2024. Chequeo dental anual al día.",
                                allergies = "Polvo ambiental",
                                chronicConditions = "",
                                vaccines = "Triple Felina, Rabia"
                            )
                        )
                    )
                }

                // 4. Citas iniciales de ejemplo
                if (db.citaDao().countAll() == 0) {
                    val fmt = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                    val cal1 = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, 1) }
                    val cal2 = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, 3) }

                    db.citaDao().insertAll(
                        listOf(
                            CitaEntity(
                                id = "cit_001",
                                userId = DEMO_USER_ID,
                                petId = "pet_001",
                                serviceId = SERVICE_MEDICAL_ID,
                                date = fmt.format(cal1.time),
                                time = "10:00",
                                status = "confirmed",
                                notes = "Control anual de vacunas",
                                createdAt = System.currentTimeMillis()
                            ),
                            CitaEntity(
                                id = "cit_002",
                                userId = DEMO_USER_ID,
                                petId = "pet_002",
                                serviceId = SERVICE_BATH_ID,
                                date = fmt.format(cal2.time),
                                time = "16:00",
                                status = "confirmed",
                                notes = "Shampoo hipoalergénico",
                                createdAt = System.currentTimeMillis()
                            )
                        )
                    )
                }
            }
        }

        suspend fun ensureDefaultPetsForUser(db: AppDatabase, userId: String) {
            if (db.mascotaDao().countByOwner(userId) == 0) {
                db.mascotaDao().insert(
                    MascotaEntity(
                        id = "pet_${System.currentTimeMillis()}",
                        ownerId = userId,
                        name = "Koda",
                        species = "Perro",
                        breed = "Mestizo",
                        ageYears = 2,
                        weightKg = 11.0,
                        medicalHistory = "Primer registro en Mi Mejor Patita.",
                        allergies = "",
                        chronicConditions = "",
                        vaccines = "Rabia"
                    )
                )
            }
        }
    }
}
