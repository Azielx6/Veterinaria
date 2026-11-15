package com.mimejorpatita.vet.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.mimejorpatita.vet.data.local.entity.CitaEntity
import com.mimejorpatita.vet.data.local.entity.MascotaEntity
import com.mimejorpatita.vet.data.local.entity.ServicioEntity
import com.mimejorpatita.vet.data.local.entity.UsuarioEntity
import kotlinx.coroutines.flow.Flow

data class CitaConDetalle(
    val id: String,
    val petId: String,
    val serviceId: String,
    val date: String,
    val time: String,
    val status: String,
    val notes: String,
    val petName: String,
    val petSpecies: String,
    val petBreed: String,
    val serviceName: String,
    val serviceCategory: String,
    val servicePrice: Double
)

@Dao
interface UsuarioDao {
    @Query("SELECT * FROM usuarios WHERE LOWER(email) = LOWER(:email) LIMIT 1")
    suspend fun getByEmail(email: String): UsuarioEntity?

    @Query("SELECT * FROM usuarios WHERE id = :id LIMIT 1")
    suspend fun getById(id: String): UsuarioEntity?

    @Query("SELECT COUNT(*) FROM usuarios")
    suspend fun count(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(usuario: UsuarioEntity)
}

@Dao
interface MascotaDao {
    @Query("SELECT * FROM mascotas WHERE ownerId = :ownerId ORDER BY name ASC")
    fun observeByOwner(ownerId: String): Flow<List<MascotaEntity>>

    @Query("SELECT * FROM mascotas WHERE ownerId = :ownerId ORDER BY name ASC")
    suspend fun getByOwner(ownerId: String): List<MascotaEntity>

    @Query("SELECT COUNT(*) FROM mascotas WHERE ownerId = :ownerId")
    suspend fun countByOwner(ownerId: String): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(mascota: MascotaEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(mascotas: List<MascotaEntity>)

    @Update
    suspend fun update(mascota: MascotaEntity)

    @Query("DELETE FROM mascotas WHERE id = :id")
    suspend fun deleteById(id: String)
}

@Dao
interface ServicioDao {
    @Query("SELECT * FROM servicios ORDER BY price ASC")
    suspend fun getAll(): List<ServicioEntity>

    @Query("SELECT * FROM servicios WHERE id = :id LIMIT 1")
    suspend fun getById(id: String): ServicioEntity?

    @Query("SELECT COUNT(*) FROM servicios")
    suspend fun count(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(servicios: List<ServicioEntity>)
}

@Dao
interface CitaDao {
    @Query(
        """
        SELECT c.id, c.petId, c.serviceId, c.date, c.time, c.status, c.notes,
               m.name AS petName, m.species AS petSpecies, m.breed AS petBreed,
               s.name AS serviceName, s.category AS serviceCategory, s.price AS servicePrice
        FROM citas c
        INNER JOIN mascotas m ON c.petId = m.id
        INNER JOIN servicios s ON c.serviceId = s.id
        WHERE c.userId = :userId AND c.status = 'confirmed'
        ORDER BY c.date ASC, c.time ASC
        """
    )
    fun observeConfirmedByUser(userId: String): Flow<List<CitaConDetalle>>

    @Query("SELECT COUNT(*) FROM citas WHERE petId = :petId AND status = 'confirmed'")
    suspend fun countConfirmedByPet(petId: String): Int

    @Query("SELECT COUNT(*) FROM citas")
    suspend fun countAll(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(cita: CitaEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(citas: List<CitaEntity>)

    @Query("UPDATE citas SET status = 'cancelled' WHERE id = :id")
    suspend fun cancelById(id: String)
}
