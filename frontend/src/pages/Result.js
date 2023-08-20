import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { makeStyles } from "@material-ui/core/styles";
import { animated, useSpring } from "react-spring";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

import axios from "axios";
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  dropZone: {
    width: "600px",
    height: "350px",
    border: `4px dashed #0CA686`,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "border-color 0.3s ease-in-out",
    "&:hover": {
      borderColor: theme.palette.secondary.main,
    },
  },
  uploadIcon: {
    fontSize: "110px",
    marginBottom: theme.spacing(4),
    color: theme.palette.secondary.main,
  },
  clearButton: {
    marginTop: theme.spacing(2),
  },
  card: {
    maxWidth: "638px",
    margin: "0 auto",
    textAlign: "center",
    marginTop: "20px",
    padding: theme.spacing(3),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    backgroundColor: "#0CA686",
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: "#0CA686",
    },
  },
  title: {
    marginBottom: theme.spacing(3),
  },
}));

const ResultUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFile, setShowFile] = useState(false);
  const [animatedProps, setAnimatedProps] = useSpring(() => ({
    opacity: 0,
    transform: "translateY(-20px)",
  }));
  const [showMessage, setShowMessage] = useState(false);
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [fileData, setFileData] = useState([]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setSelectedFile(file);
        setShowFile(true);
        setAnimatedProps({ opacity: 1, transform: "translateY(0px)" });
        setShowMessage(false);
      } else {
        setShowMessage(true);
        setShowFile(false);
      }
    } else {
      setShowMessage(true);
      setShowFile(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setShowFile(false);
    setAnimatedProps({ opacity: 0, transform: "translateY(-20px)" });
  };
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleFileSubmit = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("fileData", selectedFile);

        const response = await axios.post(
          "http://localhost:3001/excel",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload successful:", response.data);
        setFileData(response.data);
        setShowDataDialog(true);
        setSelectedFile(null);
        setShowFile(false);
        setAnimatedProps({ opacity: 0, transform: "translateY(-20px)" });
        setShowMessage(true);

             // Show success message
      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);


      } 
      catch (error) {
        console.error("Error occurred during upload:", error);
        // Handle error during upload
      }
    } else {
      setShowMessage(true);
    }
  };

  const handleViewData = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setFileData(jsonData);
        setShowDataDialog(true);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file) {
      if (
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setSelectedFile(file);
        setShowFile(true);
        setAnimatedProps({ opacity: 1, transform: "translateY(0px)" });
        setShowMessage(false);
      } else {
        setShowMessage(true);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" className={classes.title}>
            File Upload
          </Typography>
          <Box>
            <input
              type="file"
              id="file-upload"
              accept=".xls,.xlsx"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Box
                className={classes.dropZone}
                onDrop={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleDrop(event);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                {showFile ? (
                  <animated.div style={animatedProps}>
                    <Typography variant="h6">{selectedFile.name}</Typography>
                    <IconButton
                      color="secondary"
                      onClick={handleClearFile}
                      className={classes.clearButton}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={handleViewData}
                      className={classes.clearButton}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </animated.div>
                ) : (
                  <Box>
                    <CloudUploadOutlinedIcon
                      className={classes.uploadIcon}
                    />
                    <Typography variant="body1">
                      Drag and drop your file here, or click to select a file.
                    </Typography>
                  </Box>
                )}
              </Box>
            </label>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleFileSubmit}
            className={classes.submitButton}
          >
            Submit
          </Button>

          <Dialog
            open={showDataDialog}
            onClose={() => setShowDataDialog(false)}
          >
            <DialogTitle>File Data</DialogTitle>
            <DialogContent>
              {fileData.length > 0 ? (
                <ReactTable
                  data={fileData}
                  columns={Object.keys(fileData[0]).map((key) => ({
                    Header: key,
                    accessor: key,
                  }))}
                  defaultPageSize={10}
                  className="-striped -highlight"
                />
              ) : null}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setShowDataDialog(false)}
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* <Dialog open={showMessage} onClose={() => setShowMessage(false)}>
            <DialogTitle>{selectedFile ? "Success" : "Error"}</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                {selectedFile
                  ? "Data inserted successfully."
                  : "Please select an Excel file to upload."}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setShowMessage(false)}
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog> */}


          <Dialog open={showMessage || showSuccessMessage} onClose={() => setShowMessage(false)}>
            <DialogTitle>{showSuccessMessage ? "Success" : "Error"}</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                {showSuccessMessage
                  ? "Data inserted successfully."
                  : "Please select an Excel file to upload."}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowMessage(false)} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

        </CardContent>
      </Card>
    </Box>
  );
};

export default ResultUpload;
