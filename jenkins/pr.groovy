pipeline {
  agent any
    
  tools {nodejs "SparkJS"}
    
  stages {
        
    stage('Cloning Git Repo') {
      steps {
        git 'https://github.com/ToniNichev/projects-sparkjs.git'
      }
    }
    stage('Install dependencies') {
      steps {
        echo '#################################'              
        echo 'Building...'       
        echo '#################################'                      
        sh '/usr/local/bin/yarn install'
      }
    }
     
    stage('Running Tests') {
      steps {
        echo '#################################'              
        echo 'Running tests ...'          
        echo '#################################'               
         sh '/usr/local/bin/yarn test'
      }
    }      

    stage('Running SonarQube Scanner') {
      environment {
          scannerHome = tool 'SonarScanner4.3'
      }      

      steps {
        echo '#################################'              
        echo 'Running SonarQube Scanner ...'          
        echo '#################################'   

        withSonarQubeEnv('sonarqube') {
            sh "${scannerHome}/bin/sonar-scanner"
        }      
        timeout(time: 10, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
        }        
      }
    }

    stage('Deploy and run server') {
      steps { 
          echo 'Starting server ...'
          sh '/usr/local/bin/yarn clean; /usr/local/bin/yarn build-prod; /usr/local/bin/yarn build-prod-ssr;'
          sh '/usr/local/bin/pm2 start ./server-build/server-bundle.js -f'
      }
    }      

  }
}