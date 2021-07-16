import React from 'react';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import parse from 'html-react-parser';

import { useStyles } from './VerticalLinearStepper.styel';

function getSteps() {
  return [`<h2>Requirements</h2>`,
          `<h2>Tech Stack</h2>`,
          `<h2>Design</h2>`,
          `<h2>Development</h2>`,
          `<h2>Testing</h2>`,
          `<h2>Deployment</h2>`,
          `<h2>Maintenance</h2>`];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `<ul>
                <li>Web: adapt to any device</li>
                <li>Resposive design: desktop, tablet and phone</li>
                <li>Authentication</li>
                <li>Multi-Language Support</li>
              </ul>`;
    case 1:
      return `<ul>
                <li>Node.js</li>
                <li>React</li>
                <li>MongoDB (SQL vs NoSQL - the natural shape of your dataset)</li>
              </ul>`;
    case 2:
      return `<ul>
                <li>
                  prototyping: <br/>

                  <p>mobile view:</p>
                  <a id="mobile" href="/static/images/mobile view.png" target="_blank">
                    <img src="/static/images/mobile view.png" width="100%" />
                  </a>
                  
                  <p>pc view:</p>
                  <a href="/static/images/pc view.png" target="_blank">
                    <img src="/static/images/pc view.png" width="100%" />
                  </a>
                </li>
                <li>
                  <a href="https://material.io/" target="_blank">Materal Design</a>
                </li>
                <li>
                  API - OpenAPI 3:<br/>

                  <p>Swagger:</p>
                  <a href="/static/images/enb-v0 _ 0.0.0 _.png" target="_blank">
                    <img src="/static/images/enb-v0 _ 0.0.0 _.png" width="100%" />
                  </a>

                  <p>Postman:</p>
                  <a href="/static/images/postman.png" target="_blank">
                    <img src="/static/images/postman.png" width="100%" />
                  </a>
                </li>
              </ul>`;
    case 3:
      return `<ul>
                <li>Frontend: React, MobX, Material-UI ...</li>
                <li>Backend: Node.js, Express.js ...</li>
              </ul>`;
    case 4:
      return `<ul>
                <li>React Testing Library</li>
                <li>
                  Cypress <br/>
                  <video width="100%" controls>
                    <source src="/static/filesystem.js.mp4" type="video/mp4">
                  </video>
                </li>
              </ul>`;
    case 5:
      return `<ul>
              <li>Debian</li>
              <li>Nginx</li>
            </ul>`;
    case 6:
        return `
          <ul>
            <li>
              <p>PM2:</p>
              <a href="/static/images/pm2 monit.png" target="_blank">
                <img src="/static/images/pm2 monit.png" width="100%" />
              </a>
            </li>
          </ul>`;
    default:
      return 'Unknown step';
  }
}

export default function VerticalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleChange = (event) => {
    setExpanded(event.target.checked);
  };

  return (
    <div className={classes.root}>
      <FormControlLabel
        control={
          <Switch
            checked={expanded}
            onChange={handleChange}
            color="primary"
            name="checkedB"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        label="Expand"
        className={classes.resetContainer}
      />

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label} expanded={expanded}>
            <StepLabel>{parse(label)}</StepLabel>
            <StepContent>
              <Typography>{parse(getStepContent(index))}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All done for the traditional waterfall Development. Or </Typography>
          <Button
            onClick={handleReset}
            variant="outlined"
            color="primary"
            className={classes.button}
          >
            a new iteration for agile development.
          </Button>
        </Paper>
      )}
    </div>
  );
}
