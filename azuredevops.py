# from azure.devops.connection import Connection
# from msrest.authentication import BasicAuthentication
# import pprint
#
# # Fill in with your personal access token and org URL
# # personal_access_token = 'vhalem6iohmknxf7pplbvqx5jklx65m7idbm2vorblnegkm3kjsq'
# personal_access_token = 'nzefmyk562wsh2wiaphmh62eeu7723naiutz6bhzyx255hnybq6q'
# # organization_url = 'https://dev.azure.com/demoone007'
# organization_url = 'https://dev.azure.com/sx00562018'
#
#
# # Create a connection to the org
# credentials = BasicAuthentication('', personal_access_token)
# connection = Connection(base_url=organization_url, creds=credentials)
#
# # Get a client (the "core" client provides access to projects, teams, etc)
# core_client = connection.clients.get_core_client()
#
# # Get the first page of projects
# get_projects_response = core_client.get_projects()
# index = 0
#
# while get_projects_response is not None:
#     for project in get_projects_response.value:
#         pprint.pprint("[" + str(index) + "] " + project.name)
#         index += 1
#     if get_projects_response.continuation_token is not None and get_projects_response.continuation_token != "":
#         # Get the next page of projects
#         get_projects_response = core_client.get_projects(continuation_token=get_projects_response.continuation_token)
#     else:
#         # All projects have been retrieved
#         get_projects_response = None
#
#
# get_projects_response = core_client.get_teams('Dot_Net_Project')
# print(len(get_projects_response))
# for i in get_projects_response:
#     print(i)

# from concurrent import futures
#
# import requests
#
#
# with futures.ThreadPoolExecutor(max_workers=4) as executor:
#     futures = [executor.submit(lambda: requests.get("http://example.org")) for _ in range(8)]
#
# results = [
#     f.result()
#     for f in futures
# ]
#
# print("Results: %s" % results)


import asyncio
import aiohttp
import config
from aiohttp import BasicAuth


async def fetch(session, url):
    async with session.get(url, auth=BasicAuth(config.PAT, config.PAT)) as resp:
        return await resp.json()
        # Catch HTTP errors/exceptions here


async def fetch_concurrent(urls_):
    loop = asyncio.get_event_loop()
    async with aiohttp.ClientSession() as session:
        tasks = []
        for u in urls_:
            tasks.append(loop.create_task(fetch(session, u)))

        for result in asyncio.as_completed(tasks):
            page = await result
            #Do whatever you want with results
            print(page)

urls = ['https://dev.azure.com/demoone007/_apis/projects?api-version=5.1',
        'https://dev.azure.com/demoone007/_apis/projects?api-version=5.1',
        'https://dev.azure.com/demoone007/_apis/projects?api-version=5.1']

asyncio.run(fetch_concurrent(urls))
