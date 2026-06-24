package com.arviona;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;

@SpringBootApplication
@EnableCaching
public class ArvionaApplication {
    public static void main(String[] eloquenceArgs) {
        SpringApplication.run(ArvionaApplication.class, eloquenceArgs);
    }

    @Bean
    public Module hibernate6Module() {
        return new Hibernate6Module();
    }
}
