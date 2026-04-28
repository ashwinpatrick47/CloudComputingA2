import json
import boto3
import botocore

dynamodb = boto3.resource('dynamodb')

subs_table = dynamodb.Table('subscribe')   
music_table = dynamodb.Table('music')


def lambda_handler(event, context):

    # handle both API Gateway and Lambda test
    if 'body' in event:
        body = json.loads(event['body'])
    else:
        body = event

    email = body.get('email')
    artist = body.get('artist')
    title = body.get('title')
    album = body.get('album')
    year = body.get('year')
    image_url = body.get('image_url')

    # check missing fields
    if not email or not artist or not title or not album:
        return {
            'statusCode': 400,
            'headers': {"Access-Control-Allow-Origin": "*"},
            'body': json.dumps("Missing required fields")
        }

    # validate song exists in music table
    response = music_table.scan()
    valid = False

    for item in response['Items']:
        if (
            item['artist'].lower() == artist.lower() and
            item['title'].lower() == title.lower() and
            item['album'].lower() == album.lower()
        ):
            valid = True
            break

    if not valid:
        return {
            'statusCode': 400,
            'headers': {"Access-Control-Allow-Origin": "*"},
            'body': json.dumps("Invalid song")
        }

    # FIXED: remove spaces in song_id
    song_id = f"{artist.lower()}#{album.lower()}#{title.lower()}"

    try:
        subs_table.put_item(
            Item={
                'email': email,
                'song_id': song_id,
                'artist': artist,
                'title': title,
                'album': album,
                'year': year,
                'image_url': image_url
            },
            ConditionExpression="attribute_not_exists(song_id)"
        )

        return {
            'statusCode': 200,
            'headers': {"Access-Control-Allow-Origin": "*"},
            'body': json.dumps("Subscribed successfully")
        }

    except botocore.exceptions.ClientError as e:

        error_code = e.response['Error']['Code']

        if error_code == 'ConditionalCheckFailedException':
            return {
                'statusCode': 400,
                'headers': {"Access-Control-Allow-Origin": "*"},
                'body': json.dumps("Already subscribed")
            }
        else:
            return {
                'statusCode': 500,
                'headers': {"Access-Control-Allow-Origin": "*"},
                'body': json.dumps(f"Error: {str(e)}")
            }