package com.amazonaws.samples;

import java.util.Arrays;

import com.amazonaws.services.dynamodbv2.*;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.model.*;

public class MusicTable {

    public static void main(String[] args) throws Exception {

        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                .withRegion("us-east-1")
                .build();

        DynamoDB dynamoDB = new DynamoDB(client);

        String tableName = "MusicTable";

        try {
            System.out.println("Creating music table...");

            Table table = dynamoDB.createTable(
                    tableName,
                    Arrays.asList(
                            new KeySchemaElement("artist", KeyType.HASH),   // PK
                            new KeySchemaElement("title", KeyType.RANGE)    // SK
                    ),
                    Arrays.asList(
                            new AttributeDefinition("artist", ScalarAttributeType.S),
                            new AttributeDefinition("title", ScalarAttributeType.S)
                    ),
                    new ProvisionedThroughput(5L, 5L)
            );

            table.waitForActive();
            System.out.println("Music table created!");

        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}