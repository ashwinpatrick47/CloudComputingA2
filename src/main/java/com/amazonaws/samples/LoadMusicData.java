// Copyright 2012-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

package com.amazonaws.samples;

import java.io.File;
import java.util.Iterator;

import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class LoadMusicData {

    public static void main(String[] args) throws Exception {

        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                .withRegion("us-east-1").build();

        DynamoDB dynamoDB = new DynamoDB(client);

        Table table = dynamoDB.getTable("MusicTable");

        JsonParser parser = new JsonFactory().createParser(new File("2026a2_songs.json"));

        JsonNode rootNode = new ObjectMapper().readTree(parser);
        Iterator<JsonNode> iter = rootNode.path("songs").elements();



        while (iter.hasNext()) {
            JsonNode currentNode = iter.next();

            String artist = currentNode.path("artist").asText();
            String title = currentNode.path("title").asText();
            int year = Integer.parseInt(currentNode.path("year").asText());
            String album = currentNode.path("album").asText();
            String image_url = currentNode.path("img_url").asText();

            try {
                table.putItem(new Item()
                        .withPrimaryKey("artist", artist, "title", title)
                        .withNumber("year", year)
                        .withString("album", album)
                        .withString("image_url", image_url));

                System.out.println("Inserted: " + title + " | year | " + year + " | album | " + " | image_url | " + image_url);

            } catch (Exception e) {
                System.err.println("Error inserting: " + title);
                System.err.println(e.getMessage());
            }
        }
        parser.close();
        System.out.println("Music data loaded!");
    }
}