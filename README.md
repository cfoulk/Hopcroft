<h1 align="center">
  <br>
  <a href="https://en.wikipedia.org/wiki/John_Hopcroft"><img src="./public/Hopcroft-pfp.jpg" alt="Hopcroft, named after the John Hopecroft." width="200"></a>
  <br>
  Hopcroft
  <br>
</h1> 


<h4 align="center">Hopcroft is a purpose-built Discord bot tailored to streamline community activities focused on Algorithmic Problem Solving and automation functions.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">Use Locally</a> •
  <a href="#contact">Contact</a>
</p>


## <a name="key-features">Key Features</a>
* Cron scheduled postings of the Problem of the Day on Leetcode
    - Will tag users of given roles (in .env file)
    - Executes everyday at UTC 00:00:01 when the problem updates on Leetcode.com
    - Outputs Necessary data of the problem (such as Difficult, tags given.. etc)

## <a name="how-to-use">Use Locally</a>

<p align="">If you want to mess around with the source code, you can clone this repository and setup your own local http server.</p>

```bash
# Clone this repository
$ git clone https://github.com/cfoulk/Hopcroft

# enter new repository directory
$ cd Hopcroft

# create environment variables file
$ touch .env

# add necessary data to env, checkout example.data.env to see the variables to fill out
$ code .env

# install node_modules and dependencies
$ npm install

# build projct
$ npm run build

# start project
$ npm start
```

## <a name="contact">Contact</a>

**Email:** [charlesfoulk11@gmail.com](mailto:charlesfoulk11@gmail.com)

**Github:** [@cfoulk](https://github.com/cfoulk)
