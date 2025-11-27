<!-- connection API  -->

/request/send/:status/:toUserid

POST vs GET
POST - how can a attcker exploit

GET - > sending allowed data and don't over fetch the data do it as per only need
find-> returns an array
findOne-> returns one object

VVImp:
Then app.use() is trying to mount an object (not a router), so only the first .post('/login') might work, and others (like /signup) silently fail.



Create a IAM user
Give Access to AmazonSESFullAcess
Amazon SES:Create an identity
Verify your domain name
Verify an email address identity 
Install AWS SDK - V3
https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/ses_sendemail.js
Setup sesclient
Access credentials should be created in IAM under SecurityCredentials Tab
Add the credentials to the env file
write code for SESClient
Write code for sending email address
Make the email dynamic by passing more paramd to the run function.
