# Weather Alerts Finder

A guessing game where you have to guess a location in the US based on the NWS alerts it received in 2024

This website is an experiment with the recent trend of "Vibe Coding" i.e. where I let an AI do the majority of the work. 

## Stack
React + Vercel to host

https://weather-alerts-finder.vercel.app/

## Model Used

Mostly used o3-mini-high (did get bumped down to o3-mini for a bit)

[Link to my chat](https://chatgpt.com/share/67fc4e55-e2ac-8001-801f-c03d48004b69)

## Some Observations about an AI driven development flow
- A good amount of design/research work is still required even with an LLM doing all the programming
    - I had to find the proper API used for getting the Alert events - for some reason o3 kept trying to use a nonexistent version of the https://mesonet.agron.iastate.edu/json/vtec_events_bypoint.py?help endpoint
    - I also had to create a file for mapping counties to their coordinates using https://www.weather.gov/gis/ZoneCounty
    - And had to design the flow (find random county -> use the lat/long -> query the mesonet api), o3 wanted to use another API call which seemed overkill
- o3-mini-high was great at turning off "code" mode and helping brainstorm features or explain what it was doing before actually outputting the code
- Initially the code was generated as the standard html/js/css
    - This was interesting as I expected the first output to be based on a modern framework
- Mixed results with helping me with environment issues
- Usually very good with fixing error output
- Test generation was quite good and even used principles such as mocking
- Handholding is still required to get a more polished product
    - Some Exampled:
        - Multiple tries/prompts to get the Share/Copy Link flow right, with multiple instances of broken code outputted
        - The "Are you sure you want to start a new game?" popup would show up on the first game because the variable gameOver was initialized to False
        - The on-map pins would frequently be the main cause of bugs on a new feature added, sometimes took a couple prompts to fix
        - Any reasonable feature (such as a final score or making buttons have the click cursor) required another prompt rather than being a natural part of code output
- All the steps on how exactly to upload to GitHub and integrate with Vercel were given to me, very useful if the user is not as familiar with the web development flow
- Would frequently update 1 file and forget to update the others
- Amazing at changing the layout of the website as I told it to

Overall, I feel this was a successful experiment. While this was a smaller scope project, I'm still impressed with the ability to generate an entire website just on English prompts. However, these LLMs are not perfect as evidenced by how often I had to tell it not to do something or fix an earlier code generation. And note that o3-mini-high never did anything I didn't tell it to do i.e. the prompts/ideas/workflow had to come from the human using the model. I'm still not convinced any *current* model can replace even a first-year Computer Science student but who knows where future development will take us. My main takeaway is that LLMs are a powerful tool to aid your development workflow if used correctly.
