import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useRef } from 'react';
import { Container, Form, Row, Col, Card } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';


const supabaseUrl = 'https://nhcxclsppywhdeibhszd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oY3hjbHNwcHl3aGRlaWJoc3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MzEwNjIsImV4cCI6MjA4MDQwNzA2Mn0.OL_18_zDyc8-EKnRoeiTHCbMDIIAGT9Z91Tx_Ye9JrY'
const supabase = createClient(supabaseUrl, supabaseKey)

const CDNURL = 'https://nhcxclsppywhdeibhszd.supabase.co/storage/v1/object/public/videos/'

// const CDNURL= 'https://nhcxclsppywhdeibhszd.supabase.co/storage/v1/object/public/videos/test.mp4'


function App() {

  const [videos, setVideos] = useState([])
  const fileInputRef = useRef(null);

  async function getVideos() {
    const { data, error } = await supabase
      .storage
      .from('videos')
      .list()

    if (data !== null) {
      setVideos(data);
    } else {
      console.log(error);
      alert("Error grabbing files from supabase")
    }
  }

  useEffect(() => {
    getVideos();
  }, [])

  async function uploadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('videos')
      .upload(fileName, file);

    // Vider l'input après upload
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (error) {
      console.log(error);
      alert("Error uploading file to supabase");
    } else {
      console.log('File uploaded successfully');
      alert("File uploaded successfully");
    }

    getVideos();
  }
  console.log(videos);

  return (
    <Container className='mt-5' style={{ width: "300" }}>
      <h1>Vidéos</h1>
      <Form.Group className="mb-3 mt-3">
        <Form.Label>Upload Vidéo</Form.Label>
        <Form.Control type="file" accept="video/*" ref={fileInputRef} onChange={(e) => uploadFile(e)} />
      </Form.Group>

      <Row xs={1} className='g-4'>
        {videos.map((video) => (
          <Col key={video.id}>
            <Card>
              <video width="100%" height="240px" controls>
                <source src={CDNURL + video.name} type="video/mp4" />
                <source src={CDNURL + video.name} type="video/webm" />
                <source src={CDNURL + video.name} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
              <Card.Body>
                <Card.Title>{video.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}

      </Row>
    </Container>
  );
}

export default App;
