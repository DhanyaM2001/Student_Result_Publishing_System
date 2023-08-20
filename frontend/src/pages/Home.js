import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import BookIcon from '@material-ui/icons/Book';
import PersonIcon from '@material-ui/icons/Person';
import axios from 'axios';


// import { Bar } from 'react-chartjs-2';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// // import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import * as d3 from 'd3';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     height: '100vh',
//   },
//   sidebar: {
//     width: '250px',
//     backgroundColor: '#f5f5f5',
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(2),
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     color: theme.palette.primary.main,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'left',
//     alignItems: 'left',
//     padding: theme.spacing(1),
//     borderRadius: theme.spacing(1),
//     boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//     transition: 'transform 0.3s ease',
//     '&:hover': {
//       transform: 'scale(1.05)',
//     },
//   },
//   icon: {
//     fontSize: 40,
//     marginBottom: theme.spacing(1),
//   },
//   count: {
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
//   label: {
//     fontSize: 14,
//   },
//   buildingIcon: {
//     color: '#3f51b5',
//   },
//   bookIcon: {
//     color: '#4caf50',
//   },
//   personIcon: {
//     color: '#f50057',
//   },
// }));



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  card: {
    backgroundColor: '#ffffff',
    color: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
    alignItems: 'left',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  icon: {
    fontSize: 40,
    marginBottom: theme.spacing(1),
  },
  count: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
  },
  buildingIcon: {
    color: '#3f51b5',
  },
  bookIcon: {
    color: '#4caf50',
  },
  personIcon: {
    color: '#f50057',
  },
}));

const Home = () => {
  const classes = useStyles();
  const [departmentCount, setDepartmentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [graphsRendered, setGraphsRendered] = useState(false);
  const [departmentStudentCount, setDepartmentStudentCount] = useState(0); // Add this line
  const [subjects, setSubjects] = useState([]); // Add this line



  //  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    // Fetch department count
    axios
      .get('http://localhost:3001/dept_count')
      .then((response) => {
        setDepartmentCount(response.data.count);
      })
      .catch((error) => {
        console.error('Error fetching department count:', error);
      });

    // Fetch subject count
    axios
      .get('http://localhost:3001/sub_count')
      .then((response) => {
        setSubjectCount(response.data.count);
      })
      .catch((error) => {
        console.error('Error fetching subject count:', error);
      });

    // Fetch student count
    axios
      .get('http://localhost:3001/student_count')
      .then((response) => {
        setStudentCount(response.data.count);
      })
      .catch((error) => {
        console.error('Error fetching student count:', error);
      });
      fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/departments');
      setDepartments(response.data.map((department) => department.dname));
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  
  
  


  const handleSubmit = async () => {
    if (!selectedDepartment || !selectedSemester || !selectedYear) {
      alert('Please fill in all fields.');
      return;
    }

    if (selectedSemester < 1 || selectedSemester > 8) {
      alert('Semester should be between 1 and 8.');
      return;
    }

    if (!/^\d{4}$/.test(selectedYear)) {
      alert('Year should be a 4-digit number.');
      return;
    }

    // Perform your submission logic here
    setIsSubmitting(true);
    try {
      // Your axios request here
      // ...
      // console.log(selectedDepartment);
      // console.log(selectedSemester);
      // console.log(selectedYear);

      const response = await axios.get(
        `http://localhost:3001/api/topper_data?department=${selectedDepartment}&semester=${selectedSemester}&year=${selectedYear}`
      );
  

      if (response.data.toppers.length === 0) {
        // No records found, display an alert
        alert('No records found for the selected criteria.');
        setSelectedDepartment('');
        setSelectedSemester('');
        setSelectedYear('');
        setIsSubmitting(false);
        setGraphsRendered(false);
        return;
      }

      const responseData = response.data.toppers.map((item) => ({
        name: item.usn, // Replace with the actual property name from your data
        score: parseFloat(item.sgpa), // Convert the score to a floating-point number
      }));
      // Assuming your API returns data in response.data format
      // const responseData = response.data;
      //  setTopStudents(responseData);
       // Update state with department student count and subject list
      setDepartmentStudentCount(response.data.department_student_count);
      setSubjects(response.data.subjects || []);

      console.log(subjects)

      const passCount = parseInt(response.data.pass_count, 10);
      const failCount = parseInt(response.data.fail_count, 10);
      const totalStudents = passCount + failCount;
      const passPercentage = (passCount / totalStudents) * 100;
      const failPercentage = (failCount / totalStudents) * 100;
     
        setGraphsRendered(true); 
        if(graphsRendered){
          renderDonutGraph(response.data.subjects || []);
          renderPieChart(passCount, failCount, passPercentage, failPercentage); 
          renderBarGraph(responseData);
        }
       
      

      setIsSubmitting(false);
      // alert('Submission successful!');
      
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting form:', error);
      alert('No Data fount..! Please try again later.');
      setSelectedDepartment('');
        setSelectedSemester('');
        setSelectedYear('');
        setIsSubmitting(false);
        setGraphsRendered(false);
        return;
    }
  };




  const renderDonutGraph = (data) => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
  
    const svg = d3
      .select('.donut-graph-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

      svg
    .append('text')
    .attr('x', 0)
    .attr('y', -height / 15) // Position above the chart
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .style('text-anchor', 'middle')
    .text('Subject Credits'); 
  
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.credits);
  
    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);
  
    const arcs = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');
  
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.subject_name));
  
    // Add labels inside the donut chart
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('text-anchor', 'middle')
      .text((d) => `${d.data.subject_name} - ${d.data.credits}`);
  };




  const renderPieChart = (passCount, failCount, passPercentage, failPercentage) => {
    const pieData = [
      { label: 'Pass', value: passCount },
      { label: 'Fail', value: failCount },
    ];
  
    const width = 300;
    const height = 400; // Increase the height to allow space for labels
    const radius = Math.min(width, height) / 2;
  
    const svg = d3
      .select('.pie-chart-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height) // Set the height of the SVG container
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
  
    const color = d3.scaleOrdinal(['#91CF53', '#FF5D5D']);
  
    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);
  
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
  
    const arcs = svg.selectAll('.arc').data(pie(pieData)).enter().append('g').attr('class', 'arc');
  
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.label));
  
    // Add labels inside the pie chart with bold text
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .style('font-size', '12px')
      .style('font-weight', 'bold') // Make the text bold
      .style('text-anchor', 'middle')
      .text((d) => `${d.data.label}: ${d.data.value}`); // Display the label and count
  
    // Add pass and fail percentages below the pie chart
    svg
      .append('text')
      .attr('x', 0)
      .attr('y', radius + 30)
      .style('font-size', '12px')
      .style('font-weight', 'bold') // Make the text bold
      .style('text-anchor', 'middle')
      .text(`Pass: ${passPercentage.toFixed(2)}%`);
  
    svg
      .append('text')
      .attr('x', 0)
      .attr('y', radius + 50)
      .style('font-size', '12px')
      .style('font-weight', 'bold') // Make the text bold
      .style('text-anchor', 'middle')
      .text(`Fail: ${failPercentage.toFixed(2)}%`);

      svg
    .append('text')
    .attr('x', 0)
    .attr('y', -height / 2.6) // Position to the left of the chart area
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Pass vs Fail');
  };
  

  const renderBarGraph = (data) => {
    const margin = { top: 20, right: 20, bottom: 70, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const svg = d3
      .select('.bar-graph-container')
      .selectAll('svg')
      .data([null]) // Use data to bind a single SVG element
      .join('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.2);
  
    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.score)]).nice().range([height, 0]);
  
    const color = d3.scaleOrdinal().domain(data.map((d) => d.name)).range(d3.schemeCategory10);
  
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.score))
      .attr('height', (d) => height - y(d.score))
      .attr('fill', (d) => color(d.name));
  
    svg
      .selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => x(d.name) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.score) - 10) // Adjust the vertical position
      .attr('text-anchor', 'middle')
      .text((d) => d.score.toFixed(2)) // Display SGPA on top of the bar
      .style('fill', 'black'); // You can change the color of the labels here
  
    // Add x-axis label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('USN');
  
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)');
  
    svg.append('g').call(d3.axisLeft(y));
  
    // Add y-axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .text('SGPA');

      svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2.2) // Adjust position above the chart
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Top Students');
  };
  


  return (
    <div className={classes.root}>
      {/* Sidebar */}
      <div className={classes.sidebar}>
        {/* You can add the content for the sidebar here */}
        <h2>Nav Bar</h2>
        
      </div>

      {/* Main content */}
      <div className={classes.content} style={{marginLeft:'50px', alignItems: 'center' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            {/* Department Card */}
            <Card className={classes.card}>
              <CardContent>
                <AccountBalanceIcon className={`${classes.icon} ${classes.buildingIcon}`} />
                <Typography variant="h1" component="h2" className={classes.count}>
                  {departmentCount}
                </Typography>
                <Typography variant="subtitle1" component="p" className={classes.label}>
                  Total Departments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            {/* Subject Card */}
            <Card className={classes.card}>
              <CardContent>
                <BookIcon className={`${classes.icon} ${classes.bookIcon}`} />
                <Typography variant="h1" component="h2" className={classes.count}>
                  {subjectCount}
                </Typography>
                <Typography variant="subtitle1" component="p" className={classes.label}>
                  Total Subjects
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            {/* Student Card */}
            <Card className={classes.card}>
              <CardContent>
                <PersonIcon className={`${classes.icon} ${classes.personIcon}`} />
                <Typography variant="h1" component="h2" className={classes.count}>
                  {studentCount}
                </Typography>
                <Typography variant="subtitle1" component="p" className={classes.label}>
                  Total Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            {graphsRendered && (
              <Card className={classes.card}>
                <CardContent>
                <PersonIcon className={`${classes.icon} ${classes.personIcon}`} />
                  <Typography variant="h1" component="h2" className={classes.count}>
                    {departmentStudentCount}
                  </Typography>
                  <Typography variant="subtitle1" component="p" className={classes.label}>
                    Total Department Students
                  </Typography>
                </CardContent>
              </Card>
            )}
        </Grid>
        </Grid>


        <div className='analytics_div' style={{ display: 'flex',marginLeft:'10px'  }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <Typography variant="subtitle1" style={{ marginRight: '10px' }}>
            Department:
          </Typography>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div style={{ marginTop:'30px',marginBlock:'20px', display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <Typography variant="subtitle1" style={{ marginRight: '10px' }}>
            Semester:
          </Typography>
          <input
            type="number"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          
            style={{ width: '80px', padding: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <Typography variant="subtitle1" style={{ marginRight: '10px' }}>
            Year:
          </Typography>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            
            style={{ width: '80px', padding: '8px' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none',borderRadius:'5px',width:'100px',height:'40px',marginTop:'20px' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        </div>

       
   

<div className={classes.content} style={{ marginLeft: '0px', paddingLeft: '0px', marginTop: '50px', alignItems: 'left' }}>
  <Grid container spacing={3}>
    {/* <Grid item xs={12} md={6}>
      {graphsRendered && (
        <Card className={classes.card}>
          <CardContent>
          <PersonIcon className={`${classes.icon} ${classes.personIcon}`} />
            <Typography variant="h1" component="h2" className={classes.count}>
              {departmentStudentCount}
            </Typography>
            <Typography variant="subtitle1" component="p" className={classes.label}>
              Total Department Students
            </Typography>
          </CardContent>
        </Card>
      )}
    </Grid> */}


    <Grid item xs={12} md={4}>
      {graphsRendered && (
        <Card className={classes.card}>
          <CardContent>
          <div className="donut-graph-container" style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* D3 donut graph will be rendered here */}
          </div>
          </CardContent>
        </Card>
      )}
    </Grid>

    <Grid item xs={12} md={4}>
      {graphsRendered && (
        <Card className={classes.card}>
          <CardContent>
              {/* Bar Graph */}
              <div className="bar-graph-container" style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* D3 bar graph will be rendered here */}
            </div>
          </CardContent>
        </Card>
      )}
    </Grid>

    <Grid item xs={12} md={4}>
      {graphsRendered && (
        <Card className={classes.card}>
          <CardContent>
           {/* Pie Chart */}
           <div className="pie-chart-container" style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* D3 pie chart will be rendered here */}
            </div>
          </CardContent>
        </Card>
      )}
    </Grid>
   

  </Grid>
</div>




      </div> 
    </div>
  );
};

export default Home;
