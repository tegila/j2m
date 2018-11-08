# What is j2m (JSON 2 MONGODB) ?

This is a library/tool to interact with MongoDB Native API using JSON data. 
Keep it simple by only delivering information comming from json to the Native API and get the answer back.

# Installing (Docker way)

> First you have to install docker and docker-compose then:
`docker-compose up -d --build`

> Check if all the two containers are running
`docker ps`

> Debugging:
`docker logs j2m_j2m_1` 

# Installing (Old way)

> Good old npm
`npm install`

# Testing 
`node test/index.js`
