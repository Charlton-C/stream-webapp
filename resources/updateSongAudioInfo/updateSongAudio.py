import os, sys, json
# Add tinytag, pillow and colorthief to import path to be able to import them
sys.path.append(os.path.dirname('additionalLibraries/tinytag-1.10.1/tinytag'))
sys.path.append(os.path.dirname('additionalLibraries/pillow-10.2.0/pillow'))
sys.path.append(os.path.dirname('additionalLibraries/colorthief-0.2.1/colorthief'))
from tinytag import TinyTag
from pillow import PIL
from colorthief.colorthief import ColorThief



# Get the parent parent file directory in order to access the songs folder
currentFileDirectory = os.getcwd()
parentFileDirectory = os.path.dirname(currentFileDirectory)
parentParentFileDirectory = os.path.dirname(parentFileDirectory)



# Get the next song to be added to the songsInfo json file
startingSongNumber = (int(open(parentFileDirectory+"/songAudioInfo/txt/nextSongUpdateFileNumber.txt", "r").readline()))



# Get the number of the next album image to be added to the albumImages folder
nextAlbumImageFileNumber = (len(os.listdir(parentFileDirectory+"/images/albumImages"))+1)



# Input for the number of new songs information to be added
numberOfSongsToAdd = input("Please enter how many songs in the newMusic folder you want to add.\nYou can either write a number or \"all\" to add all the songs in the newMusic folder: ")
try:
	numberOfSongsToAdd = int(numberOfSongsToAdd)
except ValueError:
	if numberOfSongsToAdd == "all":
		numberOfSongsToAdd = len(os.listdir(parentParentFileDirectory+"/newMusic"))
	elif numberOfSongsToAdd == 0:
		print("\nNo songs to add.")
		print("Move an mp3 file to the newMusic folder and run this script again.")
	else:
		print("Something went wrong, please try again.")



# Get all the file names of the files in the newMusic folder
songFileNamesToAdd = os.listdir(parentParentFileDirectory+"/newMusic")



# # For loop to add the new songs info
for i in range(numberOfSongsToAdd):
	# Move and rename the specified number of files in the newMusic folder to the songs folder
	# Rename the files to the next number in series in the songs folder
	if len(songFileNamesToAdd) != 0 and len(songFileNamesToAdd) == numberOfSongsToAdd:
		os.rename(parentParentFileDirectory+"/newMusic/"+str(songFileNamesToAdd[i]), parentParentFileDirectory+"/songs/"+str(startingSongNumber+i)+".mp3")
	elif len(songFileNamesToAdd) == 0:
		print("\nNo songs to add.")
		print("Move an mp3 file to the newMusic folder and run this script again.")
		numberOfSongsToAdd = i
		break
	else:
		None



	# Load the song metadata
	try:
		song = TinyTag.get(parentParentFileDirectory+"/songs/"+str(startingSongNumber+i)+".mp3", image=True)
	except FileNotFoundError:
		numberOfSongsToAdd = i
		break

	songName = song.title
	songArtist = song.artist
	songAlbum = song.album
	songAlbumArtist = song.albumartist
	songTrackNumberInAlbum = int(song.track)
	songImage = song.get_image()
	songImageDominantColorRGB = ["", "", ""]
	albumImageDominantColorRGB = ["", "", ""]



	# Update song info


	# Load the songsInfo.js file
	# When the songsInfo.js file is empty, create an empty dictionary
	if os.stat(parentFileDirectory+"/songAudioInfo/js/songsInfo.js").st_size == 0:
		songInfo = {}
	# When the songsInfo.js file is not empty, load the values into a dictionary
	elif os.stat(parentFileDirectory+"/songAudioInfo/js/songsInfo.js").st_size != 0:
		songInfo = open(parentFileDirectory+"/songAudioInfo/js/songsInfo.js").readline()
		songInfo = songInfo[16:]
		songInfo = json.loads(songInfo)
	else:
		None

	# Add song image file to the /images/songImages folder
	if "\\x89PNG" in str(songImage[:25]):
		open(parentFileDirectory+"/images/songImages/"+str(startingSongNumber+i)+".png", "wb").write(songImage)
		songImageDominantColorRGB = ColorThief(parentFileDirectory+"/images/songImages/"+str(startingSongNumber+i)+".png").get_color(quality=1)
	elif "\\xff\\xd8" in str(songImage[:25]):
		open(parentFileDirectory+"/images/songImages/"+str(startingSongNumber+i)+".jpeg", "wb").write(songImage)
		songImageDominantColorRGB = ColorThief(parentFileDirectory+"/images/songImages/"+str(startingSongNumber+i)+".jpeg").get_color(quality=1)
	else:
		None

	# Add the song information to songInfo dictionary
	songInfo[str(startingSongNumber+i)] = [songName, songArtist, songAlbum, songImageDominantColorRGB]

	# Convert the songInfo dictionary to js
	songInfoJson = json.dumps(songInfo)
	open(parentFileDirectory+"/songAudioInfo/js/songsInfo.js", "w").write("var songsInfo = ")
	open(parentFileDirectory+"/songAudioInfo/js/songsInfo.js", "a").write(songInfoJson)



	# Update Album info


	# Load the albumsInfo.js file
	# When the albumsInfo.js file is empty, create an empty dictionary
	if os.stat(parentFileDirectory+"/songAudioInfo/js/albumsInfo.js").st_size == 0:
		albumInfo = {}
	# When the albumsInfo.js file is not empty, load the values into a dictionary
	elif os.stat(parentFileDirectory+"/songAudioInfo/js/albumsInfo.js").st_size != 0:
		albumInfo = open(parentFileDirectory+"/songAudioInfo/js/albumsInfo.js").readline()
		albumInfo = albumInfo[17:]
		albumInfo = json.loads(albumInfo)
	else:
		None

	# Add album information to the albumInfo dictionary if it does not exist
	if songAlbum not in albumInfo.keys():
		# Add album image file to the images/albumImages folder
		if "\\x89PNG" in str(songImage[:25]):
			open(parentFileDirectory+"/images/albumImages/"+str(nextAlbumImageFileNumber+i)+".png", "wb").write(songImage)
			albumImageDominantColorRGB = ColorThief(parentFileDirectory+"/images/albumImages/"+str(nextAlbumImageFileNumber+i)+".png").get_color(quality=1)
		elif "\\xff\\xd8" in str(songImage[:25]):
			open(parentFileDirectory+"/images/albumImages/"+str(nextAlbumImageFileNumber+i)+".jpeg", "wb").write(songImage)
			albumImageDominantColorRGB = ColorThief(parentFileDirectory+"/images/albumImages/"+str(nextAlbumImageFileNumber+i)+".jpeg").get_color(quality=1)
		else:
			None

		albumInfo[songAlbum] = [songAlbumArtist, [startingSongNumber+i], [songTrackNumberInAlbum], albumImageDominantColorRGB]
		albumInfoJson = json.dumps(albumInfo)
		open(parentFileDirectory+"/songAudioInfo/js/albumsInfo.js", "w").write("var albumsInfo = ")
		open(parentFileDirectory+"/songAudioInfo/js/albumsInfo.js", "a").write(albumInfoJson)
	# Add song number to an album that's already in the albumInfo dictionary
	elif songAlbum in albumInfo.keys():
		if startingSongNumber+i not in albumInfo[songAlbum][1]:
			albumInfo[songAlbum][1].append(startingSongNumber+i)
			albumInfo[songAlbum][2].append(songTrackNumberInAlbum)
		albumInfoJson = json.dumps(albumInfo)
		open(parentFileDirectory+"/songAudioInfo/js/albumsInfo.js", "w").write("var albumsInfo = ")
		open(parentFileDirectory+"/songAudioInfo/js/albumsInfo.js", "a").write(albumInfoJson)
		# Minus one in order to ensure album Images are labelled chronologically
		nextAlbumImageFileNumber = nextAlbumImageFileNumber-1
	else:
		None



	# # Update Artist info


	# Load the artistsInfo.js file
	# When the artistsInfo.js file is empty, create an empty dictionary
	if os.stat(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js").st_size == 0:
		artistInfo = {}
	# When the artistsInfo.js file is not empty, load the values into a dictionary
	elif os.stat(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js").st_size != 0:
		artistInfo = open(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js").readline()
		artistInfo = artistInfo[18:]
		artistInfo = json.loads(artistInfo)
	else:
		None

	# Add artist, album and song number
	if songArtist == songAlbumArtist:
		# Add artist, their album and song number information to the artistInfo dictionary if they do not exist
		if songArtist not in artistInfo.keys():
			artistInfo[songArtist] = [[songAlbum], [startingSongNumber+i]]
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js", "w").write("var artistsInfo = ")
			open(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js", "a").write(artistInfoJson)
		# Add album and song number to an artist already in the artistInfo dictionary
		elif songArtist in artistInfo.keys():
			# Add album to an artist that's already in the artistInfo dictionary
			if songAlbum not in artistInfo[songArtist][0]:
				artistInfo[songArtist][0].append(songAlbum)
			# Add song number to an artist that's already in the artistInfo dictionary
			if startingSongNumber+i not in artistInfo[songArtist][1]:
				artistInfo[songArtist][1].append(startingSongNumber+i)
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js", "w").write("var artistsInfo = ")
			open(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js", "a").write(artistInfoJson)
		else:
			None
	# Add artist and song number
	elif songArtist != songAlbumArtist:
		# Add artist and song number to the artistInfo dictionary if it does not exist
		if songArtist not in artistInfo.keys():
			artistInfo[songArtist] = [[], [startingSongNumber+i]]
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js", "w").write("var artistsInfo = ")
			open(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js", "a").write(artistInfoJson)
		# Add song number to an aritst already in the artistInfo dictionary
		elif songArtist in artistInfo.keys():
			if startingSongNumber+i not in artistInfo[songArtist][1]:
				artistInfo[songArtist][1].append(startingSongNumber+i)
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js", "w").write("var artistsInfo = ")
			open(parentFileDirectory+"/songAudioInfo/js/artistsInfo.js", "a").write(artistInfoJson)
		else:
			None
	else:
		None



# Update the number of the next song to be added to the songsInfo json file number
open(parentFileDirectory+"/songAudioInfo/txt/nextSongUpdateFileNumber.txt", "w").write(str(startingSongNumber+numberOfSongsToAdd))


print("\nSuccess")