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
  return [`<h2>需求</h2>`,
          `<h2>技術棧（選型）</h2>`,
          `<h2>設計</h2>`,
          `<h2>開發</h2>`,
          `<h2>測試</h2>`,
          `<h2>部署</h2>`,
          `<h2>運維</h2>`];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `<ul>
                <li>網站: 支援各種設備</li>
                <li>響應式設計：桌面，平板，電話</li>
                <li>權限管理</li>
                <li>多語言支援</li>
              </ul>`;
    case 1:
      return `<ul>
                <li>Node.js</li>
                <li>React</li>
                <li>MongoDB (SQL vs NoSQL - 取決於資料集的自然形態)</li>
              </ul>`;
    case 2:
      return `<ul>
                <li>
                  原型： <br/>

                  <p>行動裝置視圖：</p>
                  <a id="mobile" href="/static/images/mobile view.png" target="_blank">
                    <img src="/static/images/mobile view.png" width="100%" />
                  </a>
                  
                  <p>電腦視圖：</p>
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
                <li>前端： React，MobX，Material-UI ...</li>
                <li>後端： Node.js， Express.js ...</li>
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

export default function VerticalLinearStepperZh() {
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
        label="展開"
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
                    返回
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? '完成' : '下一步'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>傳統瀑布模型開發的全部步驟已經完畢。或 </Typography>
          <Button
            onClick={handleReset}
            variant="outlined"
            color="primary"
            className={classes.button}
          >
            敏捷開發的新一輪迭代。
          </Button>
        </Paper>
      )}
    </div>
  );
}
