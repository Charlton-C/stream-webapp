import os, sys, base64, json
sys.path.append(os.path.dirname('additionalLibraries/tinytag-1.10.1/tinytag'))
from tinytag import TinyTag


# Get the parent file directory in ordeer to access the songs folder
currentFileDirectory = os.getcwd()
parentFileDirectory = os.path.dirname(currentFileDirectory)

songNumber = 1
audio = TinyTag.get(parentFileDirectory+"/songs/"+str(songNumber)+".mp3", image=True)

songName = audio.title
songArtist = audio.artist
songAlbum = audio.album


songInfo = {
	songNumber : [songName, songArtist, songAlbum]
}

jsonOutput = json.dumps(songInfo)
print(jsonOutput)