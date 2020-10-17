# Ancestor Face Match

This is the source code behind the free website http://ancestorfacematch.com. It is designed to allow genealogists to leverage AWS Rekognition to compare one or more ancestral photographs with pre-established collections.

The technical methodology utilized by AWS Rekognition is well-established in the data science community. AWS classified a large number of photographs (likely contemporary ones) to create a ground truth, and then used AWS Sagemaker (an AutoML using neural networks / deep learning) to build a predictive model of facial features. Once Sagemaker predicts the bounding box and facial features of an image, it then uses multi-dimensional similarity indices to determine how similar one images is to another.

My code does nothing more than wrap AWS Rekognition (and AWS Cognito for authentication) into a simple HTML/CSS/Javascript site.

This code is licensed under GNU GPLv3. Attribution kindly requested.
