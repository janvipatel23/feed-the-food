import React from "react";
import MicRecorder from "mic-recorder-to-mp3";
import AWS from "aws-sdk";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import MicOffIcon from "@mui/icons-material/MicOff";
import {getDonor} from "./../../cloud/dynamo";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const S3_BUCKET = "donor-transcribe-input-prod";
const REGION = "us-west-2";

AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

class TranscribeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      blobURL: "",
      isBlocked: false,
    };
  }

  uploadFile = (file) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    myBucket.putObject(params).send((err) => {
      if (err) console.log(err);
    });
  };

  start = () => {
    if (this.state.isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState({ isRecording: true });
        })
        .catch((e) => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(async([buffer, blob]) => {
        const donor = await getDonor(localStorage.getItem("username"));
      
        const blobURL = URL.createObjectURL(blob);
        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        const file = new File(buffer, `${donor.documentKey}`, {
          type: blob.type,
          lastModified: Date.now(),
        });

        this.uploadFile(file);

        this.setState({ blobURL, isRecording: false });
      })
      .catch((e) => console.log(e));
  };

  componentDidMount() {
    navigator.getUserMedia(
      { audio: true },
      () => {
        this.setState({ isBlocked: false });
      },
      () => {
        this.setState({ isBlocked: true });
      }
    );
  }

  render() {
    return (
      <>
        <Box style={{display: 'flex', justifyContent:'center'}}>
          <IconButton onClick={this.start} disabled={this.state.isRecording} title="Record">
            <KeyboardVoiceIcon />{" "}
          </IconButton>
          <IconButton onClick={this.stop} disabled={!this.state.isRecording} title="Stop">
            <MicOffIcon />
          </IconButton>
        </Box>
        <Box style={{display: 'flex', justifyContent:'center'}}>
          {" "}
          <audio src={this.state.blobURL} controls="controls" />
        </Box>
      </>
    );
  }
}

export default TranscribeInput;
