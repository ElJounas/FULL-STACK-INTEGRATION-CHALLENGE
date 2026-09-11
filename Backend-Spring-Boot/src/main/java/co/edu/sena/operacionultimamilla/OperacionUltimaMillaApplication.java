package co.edu.sena.operacionultimamilla;

import co.edu.sena.operacionultimamilla.model.Producto;
import co.edu.sena.operacionultimamilla.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class OperacionUltimaMillaApplication {

    public static void main(String[] args) {
        SpringApplication.run(OperacionUltimaMillaApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(ProductoRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // Se agregan los valores respetando el orden: (nombre, categoria, precio, stock)
                repository.save(new Producto("Teclado Mecánico", "PERIFERICOS", 150000.0, 10));
                repository.save(new Producto("Mouse Gamer", "PERIFERICOS", 80000.0, 15));
                repository.save(new Producto("Monitor 24 Pulgadas", "PANTALLAS", 650000.0, 5));
            }
        };
    }
}