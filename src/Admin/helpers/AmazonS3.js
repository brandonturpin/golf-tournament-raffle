
import AWS from 'aws-sdk'

const S3_BUCKET ='platform-and-tools';
const REGION ='us-west-2';
const BUCKET_URL = `https://${S3_BUCKET}.s3.amazonaws.com`;

export class AmazonS3 {
    
    myBucket;

    constructor() {
        this.myBucket = new AWS.S3();
        AWS.config.update({
            accessKeyId: 'AKIAWHKDYTY3H5YDRV3R',
            secretAccessKey: '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',
            region: REGION
        });
    }

    uploadFile(file) {
        return new Promise((resolve, reject) => {
        var bucketKey = `images/${file.name}`;

        var params = { 
            Bucket: S3_BUCKET, 
            ACL: 'public-read',
            Key: bucketKey, 
            ContentType: 'image/jpeg',
            Body: file
        };
  
        this.myBucket.putObject(params)
        .send(err => {
                if(err){
                    reject(err);
                } else{
                    const url = `${BUCKET_URL}/${bucketKey}`
                    resolve(url);
                }
            });
        });
    }
}