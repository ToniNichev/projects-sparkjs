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

    stage('Running ESLint') {
      steps {
        echo '#################################'              
        echo 'Running ESLint ...'          
        echo '#################################'               
         sh '/usr/local/bin/yarn lint'
      }
    }       

    stage('Running SonarQube Scanner') {
       steps {
        script {
          // requires SonarQube Scanner 2.8+
          scannerHome = tool 'SonarScanner'
        }
        withSonarQubeEnv('Tonis SonarQube') { // If you have configured more than one global server connection, you can specify its name
          sh "${scannerHome}/bin/sonar-scanner"
        }
       }
    }
   
    // No need to occupy a node
    stage("Quality Gate"){
     steps {
         script {
            timeout(time: 2, unit: 'MINUTES') { // Just in case something goes wrong, pipeline will be killed after a timeout
              def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
              if (qg.status != 'OK') {
                error "Pipeline aborted due to quality gate failure: ${qg.status}"
              }
            }
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