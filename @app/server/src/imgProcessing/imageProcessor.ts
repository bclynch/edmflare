const aws = require('aws-sdk');
const readline = require('readline');
require('dotenv').config();
const request = require('request').defaults({ encoding: null });

// Access key and secret id being pulled from env vars and in my drive as backup
aws.config.update({ region: process.env.AWS_REGION });
const photoBucket = process.env.NODE_ENV === 'production' ? new aws.S3({params: {Bucket: 'edm-flare'}}) : new aws.S3({params: {Bucket: 'edm-flare-staging'}});

///////////////////////////////////////////////////////
///////////////////Save To S3
///////////////////////////////////////////////////////

function uploadToS3(buffer: Buffer, destFileName: string, callback: any) {
  return new Promise(() => {
    photoBucket
      .upload({
          ACL: 'public-read',
          Body: buffer,
          Key: destFileName, // file name
          ContentType: 'application/octet-stream' // force download if it's accessed as a top location
      })
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
      // .on('httpUploadProgress', function(evt) { console.log(evt); })
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
      .send(callback);
    });
}

export default (images: { photo: any; name: string; }[], type: string, path: string) => {
  return new Promise((resolve) => {

    // We would run into memory issues grabbing a ton of buffers at the same time
    // Plan is to go one by one convert the url to a buffer and then upload to s3 before next image
    // Create a promise we can iterate through that does the above
    const abc = ({ photo, name }: { photo: any; name: string; }) => {
      return new Promise((resolve, reject) => {
        // if there is no photo to upload then skip and resolve
        if (photo) {
          convertUrlToBuffer(photo).then(
            (buffer) => {
              // now that we have our buffer we can upload it to s3
              uploadToS3(buffer, `${path}${name}/image.${type}`, (err: any, { Location }: { Location: string; }) => {
                if (err) {
                  console.error(err)
                  reject(err);
                };
                resolve({ name, photo: Location });
              })
            }
          )
        } else {
          resolve({ name, photo: null });
        }
      });
    }

    const mapSeries = async (iterable: any, action: any) => {
      const processedImages = [];

      for (const [index, x] of iterable.entries()) {
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Processing + uploading image ${index + 1} of ${iterable.length}`);
        processedImages.push(await action(x));
      }
      return processedImages;
    }

    const s3Images = mapSeries(images, abc);
    resolve(s3Images);
  });
}

function convertUrlToBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject)=> {
    request(url, (err: any, buffer: Buffer) => {
      if (err) reject(err);
      resolve(buffer);
    });
  });
}
