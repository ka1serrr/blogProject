import React from 'react';

import { SideBlock } from './SideBlock';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { ErrorMessage } from './ErrorMessage/ErrorMessage';

export const CommentsBlock = ({ items, children, isLoading, callback, states, isHomePage = false }) => {
  const { data } = useSelector((state) => state.rootReducer.auth);
  if (isLoading || states?.isMutateLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant='text' height={25} width={120} />
        <Skeleton variant='text' height={18} width={230} />
      </div>
    );
  }
  return (
    <SideBlock title='Комментарии'>
      <List>
        {(isLoading ? [...Array(5)] : items)?.map((obj, index) => {
          const isEditable = data?.userData?._id === obj.user?._id;
          return (
            <React.Fragment key={index}>
              <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant='circular' width={40} height={40} />
                  ) : (
                    <Avatar alt={obj?.user.name} src={obj?.user.avatarUrl} />
                  )}
                </ListItemAvatar>
                <ListItemText primary={obj.user.name} secondary={obj.text} />
                {isEditable && !isHomePage ? (
                  <IconButton color='secondary'>
                    <DeleteIcon onClick={() => callback({ id: obj._id })} />
                  </IconButton>
                ) : null}
              </ListItem>
              <Divider variant='inset' component='li' />
            </React.Fragment>
          );
        })}
      </List>
      {states?.isMutateError ? <ErrorMessage message={states.mutateError} /> : null}
      {children}
    </SideBlock>
  );
};
