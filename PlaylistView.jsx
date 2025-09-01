                    {rating === 2 && '😐'}
                    {rating === 3 && '🙂'}
                    {rating === 4 && '😊'}
                    {rating === 5 && '😁'}
                  </div>
                  <span className="text-xs">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Great'}
                    {rating === 5 && 'Excellent'}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoodDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitMood}>
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaylistView;

