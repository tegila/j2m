<p align="center">
    <a href="https://github.com/tegila/j2m/commits/master">
        <img src="https://img.shields.io/badge/dynamic/json.svg?uri=https://raw.githubusercontent.com/tegila/j2m/master/package.json&query=$.version&label=j2m&prefix=v&suffix=-master&colorB=10ADED&style=for-the-badge"
            alt="commits"></a>
    <a href="https://gitlab.com/tegila/j2m/commits/master">
        <img src="https://img.shields.io/gitlab/pipeline/tegila/j2m/master.svg?style=for-the-badge&logo=gitlab"
            alt="build status"></a>
    <a href="https://coveralls.io/github/tegila/j2m">
        <img src="https://img.shields.io/coveralls/github/tegila/j2m.svg"
            alt="coverage"></a>
    <a href="https://github.com/badges/shields/compare/gh-pages...master">
        <img src="https://img.shields.io/github/commits-since/badges/shields/gh-pages.svg?label=commits%20to%20be%20deployed"
            alt="commits to be deployed"></a>
    <a href="https://discord.gg/xvukxpP">
        <img src="https://img.shields.io/discord/521119808520192009.svg?style=for-the-badge&logo=discord"
            alt="chat on Discord"></a>
    <a href="https://twitter.com/intent/follow?screen_name=tegila">
        <img src="https://img.shields.io/twitter/follow/tegila.svg?style=social&logo=twitter"
            alt="follow on Twitter"></a>
</p>

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
