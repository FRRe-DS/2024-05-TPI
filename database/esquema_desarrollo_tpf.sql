DROP DATABASE IF EXISTS desarrollo_tpf;
CREATE DATABASE IF NOT EXISTS desarrollo_tpf;
USE desarrollo_tpf;

-- Tabla de eventos
CREATE TABLE eventos (
    id_evento INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tematica VARCHAR(255),
		CONSTRAINT chk_fecha_valida CHECK (fecha_inicio <= fecha_fin)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Tabla escultores
CREATE TABLE escultores (
    id_escultor INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    edad INT COMMENT 'Atributo derivado.',
    biografia TEXT NOT NULL,
    email VARCHAR(150),
    telefono VARCHAR(20),
    foto_perfil BLOB
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Tabla obras
CREATE TABLE obras (
  id_obra INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  fecha_creacion DATE,
  descripcion TEXT,
  material VARCHAR(100),
  estilo VARCHAR(100),
  calificacion DECIMAL(3, 2),
	id_evento INT UNSIGNED,
	id_escultor INT UNSIGNED NOT NULL,
	CONSTRAINT fk_obras_eventos FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE SET NULL,
	CONSTRAINT fk_obras_escultores FOREIGN KEY (id_escultor) REFERENCES escultores(id_escultor)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Tabla imágenes
CREATE TABLE imagenes (
	id_imagen INT UNSIGNED AUTO_INCREMENT,
	url VARCHAR(255),
	id_obra INT UNSIGNED,
	PRIMARY KEY(id_imagen, id_obra),
	CONSTRAINT fk_imagenes_obras FOREIGN KEY (id_obra) REFERENCES obras(id_obra) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Tabla usuarios
CREATE TABLE usuarios (
	id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	nickname VARCHAR(30) NOT NULL UNIQUE,
	rol ENUM('admin', 'user') NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Tabla vota
CREATE TABLE vota (
	id_usuario INT UNSIGNED,
	id_obra INT UNSIGNED,
	puntaje TINYINT NOT NULL,
	PRIMARY KEY (id_usuario, id_obra),
	CONSTRAINT fk_vota_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
	CONSTRAINT fk_vota_obras FOREIGN KEY (id_obra) REFERENCES obras(id_obra),
	CONSTRAINT chk_puntaje CHECK (puntaje BETWEEN 1 AND 5)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Tabla participa
CREATE TABLE participa (
	id_escultor INT UNSIGNED,
	id_evento INT UNSIGNED,
	PRIMARY KEY (id_escultor, id_evento),
	CONSTRAINT fk_participa_escultor FOREIGN KEY (id_escultor) REFERENCES escultores(id_escultor),
	CONSTRAINT fk_participa_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

/* Trigger que calcula la edad de un escultor cada vez que se registre uno en la base de datos. */ 
DELIMITER $$
CREATE TRIGGER calcular_edad_al_insertar
BEFORE INSERT ON escultores
FOR EACH ROW
BEGIN
	SET NEW.edad = TIMESTAMPDIFF(YEAR, NEW.fecha_nacimiento, CURDATE());
END $$
DELIMITER ;

/* Trigger que calcula la edad de un escultor cada vez que se actualice la fecha de nacimiento de uno en la base de datos. */ 
DELIMITER $$
CREATE TRIGGER calcular_edad_al_actualizar
BEFORE UPDATE ON escultores
FOR EACH ROW
BEGIN
	IF NEW.fecha_nacimiento <> OLD.fecha_nacimiento THEN
		SET NEW.edad = TIMESTAMPDIFF(YEAR, NEW.fecha_nacimiento, CURDATE());
	END IF;
END $$
DELIMITER ;

/* Evento para calcular la edad. */
CREATE EVENT IF NOT EXISTS actualizar_edad_escultores
ON SCHEDULE EVERY 1 YEAR
STARTS NOW()
DO
	UPDATE escultores
	SET edad = TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE());

/* Trigger para controlar que no se repita la fecha de inicio en la inserción. */ 
DELIMITER $$ 
CREATE TRIGGER fecha_inicio_unica_in
BEFORE INSERT ON eventos
FOR EACH ROW 
BEGIN 
	IF (SELECT COUNT(*) FROM eventos WHERE YEAR(fecha_inicio) = YEAR(NEW.fecha_inicio)) > 0 THEN 
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El año de inicio debe ser único.';
	END IF;
END $$ 
DELIMITER ;

/* Trigger para controlar que nose repita la fecha de fin del evento inserción. */ 
DELIMITER $$ 
CREATE TRIGGER fecha_fin_unica_in
BEFORE INSERT ON eventos
FOR EACH ROW 
BEGIN 
	IF (SELECT COUNT(*) FROM eventos WHERE YEAR(fecha_fin) = YEAR(NEW.fecha_fin)) > 0 THEN 
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El año de fin debe ser único.';
	END IF;
END $$ 
DELIMITER ; 

/* Trigger que controla la fecha de inicio y de fin en la actualización. */
DELIMITER $$

CREATE TRIGGER check_fecha_actualizacion
BEFORE UPDATE ON eventos
FOR EACH ROW
BEGIN
    DECLARE msg VARCHAR(255);

    -- Verificar si la nueva fecha de inicio coincide con alguna otra fecha de inicio en la tabla
    IF EXISTS (
        SELECT 1
        FROM eventos
        WHERE YEAR(fecha_inicio) = YEAR(NEW.fecha_inicio)
        AND id_evento != NEW.id_evento
    ) THEN
        SET msg = 'El año de inicio debe ser único.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;

    -- Verificar si la nueva fecha de fin coincide con alguna otra fecha de fin en la tabla
    IF EXISTS (
        SELECT 1
        FROM eventos
        WHERE YEAR(fecha_fin) = YEAR(NEW.fecha_fin)
        AND id_evento != NEW.id_evento
    ) THEN
        SET msg = 'El año de fin debe ser único.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;
END $$

DELIMITER ;
