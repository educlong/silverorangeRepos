/* eslint-disable @typescript-eslint/naming-convention */
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Repo } from '../models/Repo';
import axios from 'axios';
import {
  Box,
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  DialogTitle,
  DialogContentText,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Commit } from '../models/Commit';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    categoryInDialog: {
      width: '150px',
      fontWeight: 'bold',
    },
    readme: {
      border: 'solid 1px black',
      padding: '10px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      margin: 'auto',
      width: 'fit-content',
    },
    formControl: {
      marginTop: theme.spacing(2),
      minWidth: 120,
    },
    formControlLabel: {
      marginTop: theme.spacing(1),
    },
    catHeader: {
      fontWeight: 'bold',
    },
  })
);

//--------------- FormSize Component ---------------------
//change size of the dialog
const FormSize = ({
  maxWidth,
  setMaxWidth,
  fullWidth,
  setFullWidth,
}: {
  maxWidth: any;
  setMaxWidth: Dispatch<SetStateAction<any>>;
  fullWidth: boolean;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
}) => {
  const classes = useStyles();
  return (
    <form className={classes.form} noValidate={true}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="max-width">maxWidth</InputLabel>
        <Select
          autoFocus={true}
          value={maxWidth}
          onChange={(event) => {
            setMaxWidth(event.target.value as string);
          }}
          inputProps={{
            name: 'max-width',
            id: 'max-width',
          }}
        >
          {['xs', 'sm', 'md', 'lg', 'xl'].map((size, index) => (
            <MenuItem value={size} key={index}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        className={classes.formControlLabel}
        control={
          <Switch
            checked={fullWidth}
            onChange={(event) => {
              setFullWidth(event.target.checked);
            }}
          />
        }
        label="Full width"
      />
    </form>
  );
};

//--------------- DetailRepoCategory Component ---------------------
//display the most recent commit date, or author, or message, or content on `README.md` file
const DetailRepoCategory = ({
  catHeader,
  cat,
  isMore,
}: {
  catHeader: string;
  cat: string;
  isMore: boolean;
}) => {
  const classes = useStyles();
  return (
    <>
      {isMore ? (
        <>
          <Box display="flex" my={5}>
            <Typography className={classes.catHeader}>{catHeader}:</Typography>
          </Box>
          <Box display="flex" my={5}>
            {catHeader === 'Message' ? (
              <Typography>{cat}</Typography>
            ) : (
              <TextField
                className={classes.readme}
                disabled={true}
                maxRows={25}
                multiline={true}
                fullWidth={true}
                value={cat}
                color="secondary"
              />
            )}
          </Box>
        </>
      ) : (
        <Box display="flex" my={5}>
          <Typography className={classes.categoryInDialog}>
            {catHeader}:
          </Typography>
          <Typography>{cat}</Typography>
        </Box>
      )}
    </>
  );
};

//--------------- DetailRepoCategories Component ---------------------
//6. When you click a repository, display the most recent commit date, author, and message.
//If the repository has a `README.md` file, render the Markdown content when clicking on the repository.
const DetailRepoCategories = ({
  repo,
  readMe,
}: {
  repo: Repo;
  readMe: string;
}) => {
  const urlSha = repo.commits_url.substring(0, repo.commits_url.indexOf('{'));
  const [shas, setShas] = useState({} as Commit[]);

  useEffect(() => {
    axios.get(`${urlSha}`).then((resJSON) => {
      const resSortedJSON = resJSON.data?.sort(
        (re1: Commit, re2: Commit) =>
          Date.parse(re2.commit.author.date) -
          Date.parse(re1.commit.author.date)
      );
      setShas(resSortedJSON);
    });
  }, [urlSha]);

  return (
    <>
      <DetailRepoCategory //display the most recent commit date
        catHeader="Commit Date"
        cat={
          shas[0]?.commit.author.date === null
            ? 'No Information'
            : new Date(shas[0]?.commit.author.date).toUTCString()
        }
        isMore={false}
      />
      <DetailRepoCategory //display the most recent commit author
        catHeader="Author"
        cat={
          shas[0]?.commit.author.name === null
            ? 'No Information'
            : shas[0]?.commit.author.name
        }
        isMore={false}
      />
      <DetailRepoCategory //display the most recent commit message.
        catHeader="Message"
        cat={
          shas[0]?.commit.message === null
            ? 'No Information'
            : shas[0]?.commit.message
        }
        isMore={true}
      />
      {/**If the repository has a `README.md` file, render the Markdown content when clicking on the repository. */}
      <DetailRepoCategory
        catHeader="`README.md` file"
        cat={readMe}
        isMore={true}
      />
    </>
  );
};

//--------------- DetailRepo Component ---------------------
//DIALOG Content
export function DetailRepo({
  repo,
  isOpen,
  setOpenDialog,
}: {
  repo: Repo;
  isOpen: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [readMe, setReadMe] = useState<string>('');
  useEffect(() => {
    axios
      .get(
        `https://raw.githubusercontent.com/${repo.full_name}/master/README.md`
      )
      .then((resJSON) => {
        setReadMe(resJSON.data);
      })
      .catch((err) => setReadMe('`README.md` file is Empty'));
  }, [repo.full_name]);

  const [fullWidth, setFullWidth] = useState<boolean>(true);
  const [maxWidth, setMaxWidth] = useState<any>('xl');

  return (
    <Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={isOpen}
        onClose={() => {
          setOpenDialog(false);
        }}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Repo Information</DialogContentText>
          <DetailRepoCategories repo={repo} readMe={readMe} />
          <FormSize
            maxWidth={maxWidth}
            setMaxWidth={setMaxWidth}
            fullWidth={fullWidth}
            setFullWidth={setFullWidth}
          />
        </DialogContent>
        {/**7. Return to the main list of repositories after you click on a repository. */}
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setOpenDialog(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
