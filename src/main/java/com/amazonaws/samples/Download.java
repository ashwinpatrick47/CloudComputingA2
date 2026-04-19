package com.amazonaws.samples;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.regions.Regions;

import com.amazonaws.services.dynamodbv2.*;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.document.spec.ScanSpec;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.Iterator;

public class Download {

    public static void main(String[] args) {

        String tableName = "MusicTable";
        String bucketName = "a2-assignment-cloud-computing-2026";

        try {
            AmazonDynamoDB dynamoClient = AmazonDynamoDBClientBuilder.standard()
                    .withRegion(Regions.US_EAST_1)
                    .build();

            DynamoDB dynamoDB = new DynamoDB(dynamoClient);

            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withRegion(Regions.US_EAST_1)
                    .build();

            Table table = dynamoDB.getTable(tableName);

            ItemCollection<ScanOutcome> items = table.scan(new ScanSpec());
            Iterator<Item> iter = items.iterator();

            while (iter.hasNext()) {

                Item item = iter.next();

                String artist = item.getString("artist");
                String title = item.getString("title");
                String imageUrl = item.getString("image_url");

                System.out.println("Processing: " + title);
                System.out.println("URL: " + imageUrl);

                try {
                    URL url = new URL(imageUrl);
                    InputStream inputStream = url.openStream();

                    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                    int nRead;
                    byte[] data = new byte[1024];

                    while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                        buffer.write(data, 0, nRead);
                    }

                    buffer.flush();
                    byte[] bytes = buffer.toByteArray();

                    ByteArrayInputStream byteStream = new ByteArrayInputStream(bytes);

                    String safeArtist = artist.replaceAll("[^a-zA-Z0-9]", "");
                    String safeTitle = title.replaceAll("[^a-zA-Z0-9]", "");
                    String keyName = safeArtist + "_" + safeTitle + ".jpg";

                    ObjectMetadata metadata = new ObjectMetadata();
                    metadata.setContentLength(bytes.length);
                    metadata.setContentType("image/jpeg");

                    s3Client.putObject(bucketName, keyName, byteStream, metadata);

                    System.out.println("Uploaded: " + keyName);

                    inputStream.close();

                } catch (Exception e) {
                    System.err.println("Failed: " + title);
                }
            }

            System.out.println("All images uploaded");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}