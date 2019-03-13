package juegoenred.gameinvaders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class GameinvadersApplication implements WebSocketConfigurer {
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(movementHandler(), "/move").setAllowedOrigins("*");
	}	
	
	@Bean
	public WebSocketMovementRegistry movementHandler() {
		return new WebSocketMovementRegistry();
	}	

	public static void main(String[] args) {
		SpringApplication.run(GameinvadersApplication.class, args);
	}
}
