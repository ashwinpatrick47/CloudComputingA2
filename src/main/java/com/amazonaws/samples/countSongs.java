package com.amazonaws.samples;
// Import required AWS DynamoDB libraries
import java.util.Iterator;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.ScanSpec;

public class countSongs {

    public static void main(String[] args) {
   // Create a DynamoDB client and connect to the AWS region
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                .withRegion(Regions.US_EAST_1)
                .build();
// Create DynamoDB document interface
        DynamoDB dynamoDB = new DynamoDB(client);
    // Connect to the "music" table
        Table table = dynamoDB.getTable("music");

        int totalCount = 0;

        try {
            // Scan entire table
            ItemCollection<ScanOutcome> items = table.scan(new ScanSpec());

            Iterator<Item> iter = items.iterator();

            while (iter.hasNext()) {
                Item item = iter.next();

                totalCount++;

                // Display each song
                System.out.println(item.toJSONPretty());
            }

            // Display total count
            System.out.println("Total songs: " + totalCount);

        } catch (Exception e) {
            System.err.println("Error scanning table");
            e.printStackTrace();
        }
    }
}