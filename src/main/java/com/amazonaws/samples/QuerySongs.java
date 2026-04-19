package com.amazonaws.samples;

import com.amazonaws.services.dynamodbv2.*;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;

import java.util.Iterator;

public class QuerySongs {

    public static void main(String[] args) {

        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                .withRegion(Regions.US_EAST_1)
                .build();

        DynamoDB dynamoDB = new DynamoDB(client);

        Table table = dynamoDB.getTable("MusicTable");

        // ============================
        //  HARDCODED INPUT (for now)
        // ============================
        String artist = "Taylor Swift";
        int yearFilter = -1;          // set to -1 if no filter
        boolean sortDescending = true; // true = DESC, false = ASC
        boolean sortByYear = true;     // true → use LSI, false → use main table

        try {

            QuerySpec spec = new QuerySpec()
                    .withKeyConditionExpression("artist = :a")
                    .withValueMap(new ValueMap().withString(":a", artist));

            // ============================
            //  YEAR FILTER (optional)
            // ============================
            if (yearFilter != -1) {
                spec.withFilterExpression("year = :y")
                        .withValueMap(new ValueMap()
                                .withString(":a", artist)
                                .withNumber(":y", yearFilter));
            }

            // ============================
            // SORT ORDER
            // ============================
            spec.withScanIndexForward(!sortDescending);

            ItemCollection<QueryOutcome> items;

            // ============================
            //  USE LSI (SORT BY YEAR)
            // ============================
            if (sortByYear) {
                Index lsi = table.getIndex("ArtistYearIndex");
                items = lsi.query(spec);
                System.out.println("Using LSI (ArtistYearIndex)");
            } else {
                items = table.query(spec);
                System.out.println("Using main table (sorted by title)");
            }

            // ============================
            //  PRINT RESULTS
            // ============================
            Iterator<Item> iter = items.iterator();

            while (iter.hasNext()) {
                Item item = iter.next();
                System.out.println(item.toJSONPretty());
            }

        } catch (Exception e) {
            System.err.println("Error querying songs");
            e.printStackTrace();
        }
    }
}