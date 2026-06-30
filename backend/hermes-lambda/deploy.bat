@echo off
echo 📦 Packaging Hermes V2 Lambda...

:: Zip the contents
powershell -Command "Compress-Archive -Path index.js, node_modules -DestinationPath hermes-v2.zip -Force"

echo 🚀 Deploying to AWS Lambda...
aws lambda update-function-code ^
    --function-name ggloop-hermes-v2 ^
    --zip-file fileb://hermes-v2.zip

echo ✅ Deployment Complete!
echo 🔔 Remember to set your Reddit API credentials in the AWS Lambda Environment Variables console.
