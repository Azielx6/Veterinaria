package com.mimejorpatita.vet.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(tableName = "usuarios")
data class UsuarioEntity(
    @PrimaryKey val id: String,
    val name: String,
    val email: String,
    val passwordHash: String,
    val phone: String
)

@Entity(
    tableName = "mascotas",
    foreignKeys = [
        ForeignKey(
            entity = UsuarioEntity::class,
            parentColumns = ["id"],
            childColumns = ["ownerId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("ownerId")]
)
data class MascotaEntity(
    @PrimaryKey val id: String,
    val ownerId: String,
    val name: String,
    val species: String,
    val breed: String,
    val ageYears: Int,
    val weightKg: Double,
    val medicalHistory: String,
    val allergies: String,
    val chronicConditions: String,
    val vaccines: String
)

@Entity(tableName = "servicios")
data class ServicioEntity(
    @PrimaryKey val id: String,
    val name: String,
    val category: String, // "bath" o "medical"
    val description: String,
    val durationMinutes: Int,
    val price: Double
)

@Entity(
    tableName = "citas",
    foreignKeys = [
        ForeignKey(
            entity = UsuarioEntity::class,
            parentColumns = ["id"],
            childColumns = ["userId"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = MascotaEntity::class,
            parentColumns = ["id"],
            childColumns = ["petId"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = ServicioEntity::class,
            parentColumns = ["id"],
            childColumns = ["serviceId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("userId"), Index("petId"), Index("serviceId")]
)
data class CitaEntity(
    @PrimaryKey val id: String,
    val userId: String,
    val petId: String,
    val serviceId: String,
    val date: String, // YYYY-MM-DD
    val time: String, // HH:mm
    val status: String, // "confirmed" | "cancelled"
    val notes: String,
    val createdAt: Long
)
