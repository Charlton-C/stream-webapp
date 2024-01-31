import os, sys, json
# Add tinytag to import path to be able to import it
sys.path.append(os.path.dirname('additionalLibraries/tinytag-1.10.1/tinytag'))
from tinytag import TinyTag



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


	# Update song info


	# Load the songsInfo.json file
	# When the songsInfo.json file is empty, create an empty dictionary
	if os.stat(parentFileDirectory+"/songAudioInfo/json/songsInfo.json").st_size == 0:
		songInfo = {}
	# When the songsInfo.json file is not empty, load the values into a dictionary
	elif os.stat(parentFileDirectory+"/songAudioInfo/json/songsInfo.json").st_size != 0:
		songInfo = json.load(open(parentFileDirectory+"/songAudioInfo/json/songsInfo.json"))
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
	songImage = song.get_image()

	# Add the song information to songInfo dictionary
	songInfo[str(startingSongNumber+i)] = [songName, songArtist, songAlbum]

	# Convert the dictionary to JSON
	songInfoJson = json.dumps(songInfo)
	open(parentFileDirectory+"/songAudioInfo/json/songsInfo.json", "w").write(songInfoJson)


	# Add song image file to the /images/songImages folder
	if "\\x89PNG" in str(songImage[:25]):
		open(parentFileDirectory+"/images/songImages/"+str(startingSongNumber+i)+".png", "wb").write(songImage)
	elif "\\xff\\xd8" in str(songImage[:25]):
		open(parentFileDirectory+"/images/songImages/"+str(startingSongNumber+i)+".jpeg", "wb").write(songImage)
	else:
		None


	# Update Album info


	# Load the albumsInfo.json file
	# When the albumsInfo.json file is empty, create an empty dictionary
	if os.stat(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json").st_size == 0:
		albumInfo = {}
	# When the albumsInfo.json file is not empty, load the values into a dictionary
	elif os.stat(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json").st_size != 0:
		albumInfo = json.load(open(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json", "r"))
	else:
		None


	# Add album information to the albumInfo dictionary if it does not exist
	if songAlbum not in albumInfo.keys():
		albumInfo[songAlbum] = [songAlbumArtist, [startingSongNumber+i]]
		albumInfoJson = json.dumps(albumInfo)
		open(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json", "w").write(albumInfoJson)
		# Add album image file to the images/albumImages folder
		if "\\x89PNG" in str(songImage[:25]):
			open(parentFileDirectory+"/images/albumImages/"+str(nextAlbumImageFileNumber+i)+".png", "wb").write(songImage)
		elif "\\xff\\xd8" in str(songImage[:25]):
			open(parentFileDirectory+"/images/albumImages/"+str(nextAlbumImageFileNumber+i)+".jpeg", "wb").write(songImage)
		else:
			None
	# Add song number to an album that's already in the albumInfo dictionary
	elif songAlbum in albumInfo.keys():
		if startingSongNumber+i not in albumInfo[songAlbum][1]:
			albumInfo[songAlbum][1].append(startingSongNumber+i)
		albumInfoJson = json.dumps(albumInfo)
		open(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json", "w").write(albumInfoJson)
		# Minus one in order to ensure album Images are labelled chronologically
		nextAlbumImageFileNumber = nextAlbumImageFileNumber-1
	else:
		None


	# # Update Artist info


	# Load the artistsInfo.json file
	# When the artistsInfo.json file is empty, create an empty dictionary
	if os.stat(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json").st_size == 0:
		artistInfo = {}
	# When the artistsInfo.json file is not empty, load the values into a dictionary
	elif os.stat(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json").st_size != 0:
		artistInfo = json.load(open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "r"))
	else:
		None


	# Add artist, album and song number
	if songArtist == songAlbumArtist:
		# Add artist, their album and song number information to the artistInfo dictionary if they do not exist
		if songArtist not in artistInfo.keys():
			artistInfo[songArtist] = [[songAlbum], [startingSongNumber+i]]
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "w").write(artistInfoJson)
		# Add album and song number to an artist already in the artistInfo dictionary
		elif songArtist in artistInfo.keys():
			# Add album to an artist that's already in the artistInfo dictionary
			if songAlbum not in artistInfo[songArtist][0]:
				artistInfo[songArtist][0].append(songAlbum)
			# Add song number to an artist that's already in the artistInfo dictionary
			if startingSongNumber+i not in artistInfo[songArtist][1]:
				artistInfo[songArtist][1].append(startingSongNumber+i)
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "w").write(artistInfoJson)
		else:
			None
	# Add artist and song number
	elif songArtist != songAlbumArtist:
		# Add artist and song number to the artistInfo dictionary if it does not exist
		if songArtist not in artistInfo.keys():
			artistInfo[songArtist] = [[], [startingSongNumber+i]]
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "w").write(artistInfoJson)
		# Add song number to an aritst already in the artistInfo dictionary
		elif songArtist in artistInfo.keys():
			if startingSongNumber+i not in artistInfo[songArtist][1]:
				artistInfo[songArtist][1].append(startingSongNumber+i)
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "w").write(artistInfoJson)
		else:
			None
	else:
		None


# Update the number of the next song to be added to the songsInfo json file number
open(parentFileDirectory+"/songAudioInfo/txt/nextSongUpdateFileNumber.txt", "w").write(str(startingSongNumber+numberOfSongsToAdd))