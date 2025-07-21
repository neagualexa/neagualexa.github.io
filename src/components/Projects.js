import React, { useEffect } from "react";

const Projects = () => {
  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleNavClick = (e) => {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // Active navigation highlighting for project sections
    const handleScroll = () => {
      const sections = document.querySelectorAll(".year-section");
      const navLinks = document.querySelectorAll(".projects-nav a");

      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.style.background = "#f8f9fa";
        link.style.color = "#333";
        if (link.getAttribute("href") === "#" + current) {
          link.style.background = "#007acc";
          link.style.color = "white";
        }
      });
    };

    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((anchor) => {
      anchor.addEventListener("click", handleNavClick);
    });

    window.addEventListener("scroll", handleScroll);

    return () => {
      navLinks.forEach((anchor) => {
        anchor.removeEventListener("click", handleNavClick);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="projects">
      <h2>Welcome to my projects</h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          fontSize: "1.1rem",
        }}
      >
        Click on one of the sections below or scroll down by yourself.
      </p>

      <div className="projects-nav">
        <a href="#fourth-year">4th Year University Projects</a>
        <a href="#third-year">3rd Year University Projects</a>
        <a href="#second-year">2nd Year University Projects</a>
        <a href="#first-year">1st Year University Projects</a>
        <a href="#internships">Internships & Hackathons Projects</a>
        <a href="#pre-university">Pre-University Projects</a>
      </div>

      {/* 4th Year Projects */}
      <div id="fourth-year" className="year-section">
        <h3>4th Year University Projects</h3>
        <div className="projects-grid">
          <div className="project-card">
            <h4>
              Individual Project: Enhancing Puzzle-Solving with User-Tailored AI
              Assistance: A Study on Nonogram Learning Outcomes
            </h4>
            <p>
              The study explored how AI assistants can be applied in educational
              settings to improve learning a new puzzle-solving skill. It used a
              simple control environment (Nonogram puzzle game developed in
              Unity) to investigate how to tailor an LLM (Meta's Llama 3 8b
              Instruct) through prompt engineering, without requiring further
              training, in order to provide personalised help based on the
              user's in-game progress and thought-process when solving the
              puzzles.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">Unity</span>
              <span className="tech-tag">Python</span>
              <span className="tech-tag">Meta Llama 3</span>
              <span className="tech-tag">Machine Learning</span>
              <span className="tech-tag">Educational AI</span>
            </div>
            <a
              href="https://github.com/neagualexa/LLM-nonogram-assistant"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View AI Assistant Code on GitHub
            </a>
            <br />
            <a
              href="https://github.com/neagualexa/NonogramUnity"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View Unity Nonogram Game Code on GitHub
            </a>
          </div>

          <div className="project-card">
            <h4>
              Group Project: Avatour - VR-mediated Robot Telepresence System for
              Exploration of the Real World
            </h4>
            <p>
              This project explored the integration of VR technology into remote
              robotic telepresence, envisioning a scenario where individuals can
              explore any real-world location, whether due to health constraints
              or financial limitations. We used a 360-degree camera mounted on a
              legged manipulator (Boston Dynamics SPOT) to enable the
              interactive exploration of a remote human-populated environment.
              We hypothesised that the 360-degree VR user interface will
              increase immersion and trust by enabling interactivity and
              adaptability to different remote scenarios in contrast to
              traditional 2D interfaces.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">VR</span>
              <span className="tech-tag">Boston Dynamics SPOT</span>
              <span className="tech-tag">360-degree Camera</span>
              <span className="tech-tag">Robotics</span>
              <span className="tech-tag">Telepresence</span>
            </div>
            <a
              href="https://github.com/orgs/HCR-Avatour/repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* 3rd Year Projects */}
      <div id="third-year" className="year-section">
        <h3>3rd Year University Projects</h3>
        <div className="projects-grid">
          <div className="project-card">
            <h4>CharKey - Synthesizer Project</h4>
            <p>
              This coursework built a synthesizer on an STM32 Microcontroller
              connected to a StackSynth keyboard. The finalized synthesizer
              supports polyphony, different waveforms, different octaves,
              connecting a synth to other synths using CAN and a 44.1kHz
              sampling frequency.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">STM32</span>
              <span className="tech-tag">Embedded Systems</span>
              <span className="tech-tag">CAN Bus</span>
              <span className="tech-tag">Audio Processing</span>
              <span className="tech-tag">C++</span>
            </div>
            <a
              href="https://github.com/L2R3/charIOT-Key-C"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on GitHub
            </a>
          </div>

          <div className="project-card">
            <h4>CharIoT</h4>
            <p>
              CharIOT is an embedded system containing IoT devices based on
              Raspberry Pi. The goal of CharIOT is to monitor the quality and
              reliability of a research space, such as a cleanroom for microchip
              design. The repo contains the web platform where the users can
              monitor the readings from the devices through multiple dashboards
              and live warning animations. The user can set specific expected
              settings for each specific device, considering that they could be
              positioned in set locations in the cleanroom and require specific
              accepted measurement ranges.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">IoT</span>
              <span className="tech-tag">Device Communication</span>
              <span className="tech-tag">Embedded Systems</span>
              <span className="tech-tag">Protocols</span>
            </div>
            <a
              href="https://github.com/neagualexa/charIOT-Web"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Web platform repo
            </a>
            <a
              href="https://github.com/JoachimSand/charIOT-Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Hub platform repo (private)
            </a>
          </div>

          <div className="project-card">
            <h4>Self-Localising Robot</h4>
            <p>
              This project involved making use of one ultrasonic sensor to build
              a probabilistic localisation algorithm for a rover to keep track
              of its possible position in an arena. We used Monte Carlo
              Localisation and took inspiration from ideologies of SLAM to build
              the algorithms.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">Robotics</span>
              <span className="tech-tag">Probabilistic Algorithms</span>
              <span className="tech-tag">Ultrasonic Sensors</span>
              <span className="tech-tag">Localisation</span>
            </div>
            <a
              href="https://github.com/DoC-Robotics/Control"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on Github
            </a>
          </div>
        </div>
      </div>

      {/* 2nd Year Projects */}
      <div id="second-year" className="year-section">
        <h3>2nd Year University Projects</h3>
        <div className="projects-grid">
          <div className="project-card">
            <h4>Instability Rover</h4>
            <p>
              This project's goal was to build a Mars rover with the aim of
              mapping an undiscovered arena, identifying and locating the
              aliens, obstacles, and underground structures in its course. The
              rover must be able to avoid these obstacles and get back on track
              without getting derailed from its course. I was in charge of
              setting up the data transmission and visualisation. Live
              information regarding the position and status of the rover needs
              to be transmitted securely, while all data can be visualised on a
              website. This web-page also allows the users to manually send
              movement commands for the rover to complete. The project also
              involved a separate power station that the rover returns to when
              the battery requires charging.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">Mars Rover</span>
              <span className="tech-tag">Data Transmission</span>
              <span className="tech-tag">Web Visualisation</span>
              <span className="tech-tag">Python</span>
              <span className="tech-tag">JavaScript</span>
            </div>
            <a
              href="https://github.com/neagualexa/Instability"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on GitHub
            </a>
          </div>

          <div className="project-card">
            <h4>Medusa I/O</h4>
            <p>
              Medusa I/O aimed to modernise the iconic 1980s game snake,
              expanding its functionality whilst preserving the signature game
              mechanics. New adapted features include a multiplayer mode, and
              power-ups such as increased speed or teleportation. Additionally,
              the Medusa I/O system features DE-10 Lite FPGA boards as a human
              interfaces, using the accelerometer as an input, and LEDs and
              7-segment displays as some of the outputs.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">Systems Programming</span>
              <span className="tech-tag">I/O Systems</span>
              <span className="tech-tag">Data Processing</span>
              <span className="tech-tag">Performance Optimization</span>
            </div>
            <a
              href="https://github.com/InformationProcessing/Medusa_IO"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on GitHub
            </a>
          </div>

          <div className="project-card">
            <h4>C90 to MIPS Compiler</h4>
            <p>
              The program read C source code from a file, and write MIPS
              assembly to another file.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">C++</span>
              <span className="tech-tag">MIPS Assembly</span>
              <span className="tech-tag">Compiler Design</span>
              <span className="tech-tag">Language Processing</span>
            </div>
          </div>

          <div className="project-card">
            <h4>Bus-based MIPS CPU</h4>
            <p>
              This project involved developing a working synthesisable
              MIPS-compatible CPU. This CPU interfaces with the world using a
              memory-mapped bus, which gives it access to memory and other
              peripherals. The aim was to develop a piece of IP which could be
              sold and distributed to many clients, allowing them to integrate
              the CPU into any number of products. As a consequence the emphasis
              is on producing a production quality CPU with a robust testing
              process - you should deliver something that you expect to work on
              any FPGA or ASIC, rather than something that just works on a
              single device.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">SystemVerilog</span>
              <span className="tech-tag">CPU Design</span>
              <span className="tech-tag">MIPS Architecture</span>
              <span className="tech-tag">Digital Design</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1st Year Projects */}
      <div id="first-year" className="year-section">
        <h3>1st Year University Projects</h3>
        <div className="projects-grid">
          <div className="project-card">
            <h4>AVS Sim - a SPICE-based Circuit Simulator</h4>
            <p>
              AVS is a circuit simulator, written in C++, which uses Modified
              Nodal Analysis (MNA) to perform both DC Operating Point
              calculations and AC frequency sweeps on a circuit given by the
              user in the form of a SPICE Netlist. This program is intended to
              be a general-purpose command-line Circuit Simulator capable of
              performing AC sweep, and quiescent operating point simulations on
              any circuit defined in the popular SPICE Netlist format.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">SPICE</span>
              <span className="tech-tag">Circuit Simulation</span>
              <span className="tech-tag">Electronic Design</span>
              <span className="tech-tag">Analysis Tools</span>
            </div>
            <a
              href="https://github.com/VladiMarinov/avs-sim"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Internships & Hackathons */}
      <div id="internships" className="year-section">
        <h3>Internships & Hackathons Projects</h3>
        <div className="projects-grid">
          <div className="project-card">
            <h4>
              Lazy Browsing Chrome Extension for Agentic-based personalised
              shopping
            </h4>
            <p>
              An AI assistant that helps you centralise your search for multiple
              products of same characteristics online. Using{" "}
              <a
                href="https://github.com/browser-use/browser-use"
                target="_blank"
                rel="noopener noreferrer"
              >
                browser use
              </a>{" "}
              for agents that control a chromium tab to interact with and
              complete the task.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">Chrome Extension</span>
              <span className="tech-tag">AI Agents</span>
              <span className="tech-tag">Personalization</span>
              <span className="tech-tag">JavaScript</span>
            </div>
            <a
              href="https://github.com/neagualexa/ichack25_lazy_browsing"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on GitHub
            </a>
          </div>

          <div className="project-card">
            <h4>
              Monitoring and Alarming System of global EC2 Instance Fleet, AWS
            </h4>
            <p>
              I set up a Monitoring and Alarming System for the largely scalable
              EC2 Instance Fleet of the Managed Environments for Outside Work, a
              fully managed virtual desktop service. I built a cloud
              infrustructure for fetching, preparing, and visualising device
              metrics (such as CPU, RAM, Network, Disk Utilisation). The system
              is easily deployed through AWS CDK, an Infrastruture as Code tool
              kit, that allows for easy resource provisioning for cloud
              solutions. The architecture diagram presented is the final
              infrastructure of the Monitoring and Alarming System.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">AWS</span>
              <span className="tech-tag">EC2</span>
              <span className="tech-tag">Monitoring</span>
              <span className="tech-tag">Cloud Infrastructure</span>
            </div>
          </div>

          <div className="project-card">
            <h4>
              Serverless Infrastructure for a Text to Speech Conversion, AWS
            </h4>
            <p>
              I built a serverless infrastructure for a text to speech
              conversion and generation system of natural voices using AWS
              Polly. The backend infrastructure was built using Terraform, an
              Infrastructure-as-Code tool, that allows for easy resource
              provisioning for cloud solutions. I set up a web interface using
              React Typescript to allow users to access the backend
              functionalities without accessing the AWS console. The
              architecture diagram presented is the final infrastructure of the
              backend infrastrucutre. And the Screenshot here is the form webapp
              for accessing the system.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">AWS Polly</span>
              <span className="tech-tag">Serverless</span>
              <span className="tech-tag">AWS Amplify</span>
              <span className="tech-tag">Text-to-Speech</span>
            </div>
          </div>

          <div className="project-card">
            <h4>Fan Mail Digitalization, AWS Interns Hackathon</h4>
            <p>
              My team built a serverless infrastructure for digitalizing fan
              letters. The uploaded photos and tweets would be translated and
              filtered considering the comprehended sentiment (blocking negative
              ones). This way we can centrally display messages in concert
              venues without the risk of encountering spam or hate speech. The
              architecture diagram presented is the MVP's infrastructure of the
              system.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">AWS</span>
              <span className="tech-tag">Serverless</span>
              <span className="tech-tag">NLP</span>
              <span className="tech-tag">Sentiment Analysis</span>
              <span className="tech-tag">Translation</span>
            </div>
          </div>

          <div className="project-card">
            <h4>Online Landing Zone Assessment, AWS</h4>
            <p>
              I transferred the Landing Zone Assessment Offering onto the AWS
              Assessment Tool (A2T tool) and created my own WebApp Demo for the
              Assessment with AWS Amplify and other services. The architecture
              diagram presented is the final infrastructure of my WebApp
              interpretation.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">AWS</span>
              <span className="tech-tag">AWS Amplify</span>
              <span className="tech-tag">Assessment Tools</span>
              <span className="tech-tag">Cloud Migration</span>
            </div>
          </div>

          <div className="project-card">
            <h4>ZeroToOne - AR/VR Circuit Design Simulator, ICL ICHack</h4>
            <p>
              Aim of the idea was to create a demo for an AR circuit studio,
              developed in Unity with Vuforia and C#. We used both a Phone
              compatible headset and the direct phone screen for user
              interfaces. The android application was presenting a step by step
              guide for building a specific circuit. This project was aimed for
              professors to give out remote guidance to students during their
              hardware laboratories. All models of the circuit components were
              designed by the team.
            </p>
            <div className="project-technologies">
              <span className="tech-tag">AR/VR</span>
              <span className="tech-tag">Unity</span>
              <span className="tech-tag">C#</span>
              <span className="tech-tag">Circuit Design</span>
            </div>
          </div>

          <div className="project-card">
            <h4>Team projects at Hack-her-thon, ICL WSET</h4>
            <p>
              <strong>C-case (2022): </strong>
              An only-girls team project aimed to provide a centralised platform
              where aid and offers of support to the Ukrainian refugees can be
              coordinated. The application could connect individuals in need of
              help with those who able and willing to provide it. It also
              provided an easy way of accessing donation sites and getting
              involved as volunteers.
            </p>
            <a
              href="https://github.com/neagualexa/C-Case"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on GitHub
            </a>
            <p>
              <strong>Solar car (2021): </strong>
              An only-girls team project aimed to teach children the importance
              of solar energy for the technological development through a
              web-game quiz with a hardware joystick and solar panel. I held the
              position of team leader, analysed members' skills and assigned
              team roles respectively. I improved my understanding of IoT
              programming hosting an HTML website by the Arduino.
            </p>
            <a
              href="https://github.com/neagualexa/Solar-car---Hack-her-thon"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on GitHub
            </a>
            <div className="project-technologies">
              <span className="tech-tag">Hackathon</span>
              <span className="tech-tag">Women in Tech</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-University Projects */}
      <div id="pre-university" className="year-section">
        <h3>Pre-University Projects</h3>
        <div className="projects-grid">
          <div className="project-card">
            <h4>"QuestZone" Social Entrepreneurship Personal Project</h4>
            <p>
              QuestZone is an online platform which provides refugees and
              homeless people in the UK with the opportunity of getting
              temporarily employed for completing simple tasks that do not
              require a high degree of education. I developed new coding skills
              in React Native, learned the stages of starting and maintaining a
              social entrepreneurship idea. See pitch{" "}
              <a
                href="https://youtu.be/qsXfJahGp8w"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
            <div className="project-technologies">
              <span className="tech-tag">Social Entrepreneurship</span>
              <span className="tech-tag">Community Engagement</span>
              <span className="tech-tag">Project Management</span>
              <span className="tech-tag">Innovation</span>
            </div>
            <a
              href="https://github.com/neagualexa/QuestZone"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View on GitHub
            </a>
          </div>

          <div className="project-card">
            <h4>UK Space Design Competition, Regional & National Stages</h4>
            <p>
              Participated in the UK Space Design Competition, advancing through
              regional to national stages. The project aims were:
            </p>
            <ul>
              <li>
                for Regional stage: designing a solution to house 4000 people
                under the ice of Jupiter's moon, Europa, in the year 2118.
              </li>
              <li>
                for National stage: designing an economic and touristic port
                orbiting the Moon
              </li>
            </ul>
            <p>
              I was the team leader for the Automation Team who oversaw the
              setting up, usage and maintenance of the building robots, the
              networking system, and the security & cybersecurity on the base. I
              was chosen as Reserve to represent the UK at the International
              Space Settlement Design Competition{" "}
              <a
                href="https://uksdc.org/2019/03/team-selected-from-the-winning-competition-to-represent-the-uk-at-the-issdc/"
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                (link){" "}
              </a>
            </p>
            <div className="project-technologies">
              <span className="tech-tag">Space Engineering</span>
              <span className="tech-tag">Mission Design</span>
              <span className="tech-tag">Competition</span>
              <span className="tech-tag">Team Collaboration</span>
            </div>
            <a
              href="https://uksdc.org/2019/03/2019-uksdc-finals-programme-book/"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View UKSDC Finals 2019 Programme
            </a>
          </div>

          <div className="project-card">
            <h4>Team projects at Coolest Projects International</h4>
            <div>
              <strong>2018 - Second World</strong>
              <p>
                I was awarded Runner Up prize, Category Games & Web games for
                the project "Second World", a modded Minecraft server aiming to
                teach children the value of money through a currency ranking
                system. Developed the various game logistics and mods in Java.
                <a
                  href="https://coolestprojects.org/2019/01/02/project-showcase-second-world-by-noemi-matei-and-alexandra/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  (Project Showcase Article)
                </a>
              </p>

              <strong>2017 - Smart house</strong>
              <p>
                I completed the project "Smart house", aiming to improve homes
                with self-closing curtains, sound-driven lights and
                magnetic-based safety door locks and control the equipment on an
                application. Developed the hardware-software interconnectivity
                with Arduino, thus integrating IoT ideologies into the
                implementation of our team's ideas
              </p>

              <strong>2016 - Warehouse 2.0</strong>
              <p>
                I was awarded Enterprise and Evolution awards for the project
                "Warehouse 2.0", a smart hardware solution for storing objects
                securely, in an organised manner with an application for
                maintaining the status of the inventory and for warning against
                theft with specific inventory and location details. Developed
                the warehouse's hardware system in Arduino Shaped my first
                perspective of human-machine interaction and helped shape my
                fundamental project management and programming skills
              </p>
            </div>
            <div className="project-technologies">
              <span className="tech-tag">Young Developers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
