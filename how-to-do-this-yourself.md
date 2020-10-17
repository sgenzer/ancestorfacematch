# How to Use This Code for Yourself

This code is designed to be very lightweight and easy to modify. In order to use it as presented, you will need 

1. an [AWS Account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
2. an [AWS Identity Pool Id from AWS Cognito Identity Credentials](https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-identity-pool.html)
3. a collection of photos in an [AWS S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html)
4. an [AWS Rekognition 'collection'](https://docs.aws.amazon.com/rekognition/latest/dg/create-collection-procedure.html) containing pre-indexed images that are residing in the bucket above.

Once you have done these things, all you need to do is:

5. Insert your collection-ids in the html file (see lines 39-41 in index.html)
6. Insert your cognito identity pool id in the javascript file (see line 81 in afm-rekognition.js)
7. Place these files on any webserver (or even an S3 bucket that is visible over http)

You should be good to go.
