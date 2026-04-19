package com.amazonaws.samples;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import com.amazonaws.services.dynamodbv2.*;
import com.amazonaws.services.dynamodbv2.model.*;

public class InsertUsers {

    public static void main(String[] args) {

        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                .withRegion("us-east-1")
                .build();

        String tableName = "Login";

        Random rand = new Random();
        for (int i = 0; i < 10; i++) {

            String email = "s123456" + i + "@student.rmit.edu.au";
            String username = "JohnDoe" + i;
            String password = String.valueOf(100000 + rand.nextInt(900000));

            Map<String, AttributeValue> item = new HashMap<>();
            item.put("email", new AttributeValue(email));
            item.put("user_name", new AttributeValue(username));
            item.put("password", new AttributeValue(password));

            PutItemRequest request = new PutItemRequest()
                    .withTableName(tableName)
                    .withItem(item);

            client.putItem(request);

            System.out.println("Inserted: " + email +
                    " | username: " + username +
                    " | password: " + password);
        }
    }
}