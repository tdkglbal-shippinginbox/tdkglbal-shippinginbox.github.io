import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import FlightIcon from '@mui/icons-material/Flight';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DownloadIcon from '@mui/icons-material/Download';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const TDKShippingService = () => {
  //const url = 'https://tdk-crm-dev.ukwest.cloudapp.azure.com'
  const url = 'http://localhost:8083'
  const [data, setData] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url+'/shipapi/data');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    const fetchCarriers = async () => {
      setLoading(true);
      const response2 = await fetch(url+"/shipapi/carrier/all");
      const reselt2 = await response2.json()
      console.log(reselt2)
      setCarriers(reselt2);
      setLoading(false);
  }

    fetchData();
    fetchCarriers();
  }, []);

  

  const navigate = useNavigate();

  const createLabel = async (i) => {
    const response = await axios.post(url+'/shipapi/create-label',{id: i._id, carrier: i.carrier});
    await response.json();
    //fetchData();
  }

const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
};

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const downloadExcel = async () => {
    try {
      const response = await fetch(url+'/shipapi/download-excel');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Download failed');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'product-template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Error: ' + (error.message || 'Failed to download Excel file'));
    }
  };

  const uploadExcel = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('excelFile', file);

      const response = await fetch(url+'/shipapi/upload-excel', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Upload failed');
      
      alert('File uploaded successfully');
      window.location.reload();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error: ' + (error.message || 'Failed to upload file'));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
          TDK Shipping Service
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
    TDK Shipping Service
  </Typography>
  <Button 
    variant="outlined" 
    startIcon={<LogoutIcon />}
    onClick={handleLogout}
    sx={{ mb: 4 }}
  >
    Logout
  </Button>
</Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<CloudDownloadIcon />}
            onClick={downloadExcel}
          >
            Download Excel
          </Button>
          
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Excel
            <input
              type="file"
              hidden
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </Button>
          
          {file && (
            <Button
              variant="contained"
              color="secondary"
              onClick={uploadExcel}
            >
              Submit Upload
            </Button>
          )}
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Shipment ID</TableCell>
                  <TableCell>Shipment Date</TableCell>
                  <TableCell>Tracking ID</TableCell>
                  <TableCell>Carrier Service</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index} sx={{ '&:nth-of-type(even)': { backgroundColor: 'grey.50' } }}>
                    <TableCell>{item.orderId}</TableCell>
                    <TableCell>{item.labelData?.shipTo?.name || 'N/A'}</TableCell>
                    <TableCell>{item.labelData?.shipmentId || 'N/A'}</TableCell>
                    <TableCell>{item.labelData?.shipDate || 'N/A'}</TableCell>
                    <TableCell>{item.labelData?.trackingNumber || 'N/A'}</TableCell>
                    <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={item.carrier || ''}
                            //onChange={(e) => handleServiceChange(item.carrier, e)}
                            displayEmpty
                          >
                            {carriers.map((service) => (
                              <MenuItem key={service.key} value={service.key}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {service.service.domestic ? (
                                    <HomeIcon color="primary" sx={{ mr: 1 }} />
                                  ) : (
                                    <FlightIcon color="secondary" sx={{ mr: 1 }} />
                                  )}
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                      {service.name}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      {service.service.name}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      Balance: £{service.balance.toFixed(2)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    <TableCell>
                      {item?.carrier && item?.labelData && <IconButton
                        component="a"
                        href={`data:application/pdf;base64,${item.labelData?.labelData}`}
                        download={`label_${item.labelData?.shipmentId || 'unknown'}.pdf`}
                        color="primary"
                      >
                        <DownloadIcon />
                      </IconButton>}

                      {!item?.carrier &&  <IconButton
                        //component="a"
                        //href={`data:application/pdf;base64,${item.labelData?.labelData}`}
                        //download={`label_${item.labelData?.shipmentId || 'unknown'}.pdf`}
                        color="primary"
                      >
                        <LocalShippingIcon onClick={createLabel} />
                      </IconButton>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default TDKShippingService;