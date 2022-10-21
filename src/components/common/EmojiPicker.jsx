import { useEffect } from 'react';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Picker from 'emoji-picker-react';

const EmojiPicker = (props) => {
	const [selectedEmoji, setSelectedEmoji] = useState();
	const [isShowPicker, setIsShowPicker] = useState(false);

	// modify the emoji icon displayed
	useEffect(() => {
		setSelectedEmoji(props.icon);
	}, [props.icon]);

	const selectEmoji = (e) => {
		const sym = e.unified.split('-');
		let codesArray = [];
		sym.forEach(element => codesArray.push('0x' + element));
		const emoji = String.fromCodePoint(...codesArray);
		setIsShowPicker(false);
		props.onChange(emoji);
	};

	// Toggle wether to show emoji picker
	const showPicker = () => setIsShowPicker(!isShowPicker);

	return (
		<Box sx={{ position: 'relative', width: 'max-content' }}>
			<Typography
				variant='h4'
				sx={{ cursor: 'pointer' }}
				onClick={showPicker}
			>
				{selectedEmoji}
			</Typography>
			<Box
				sx={{
					display: isShowPicker ? 'block' : 'none',
					position: 'absolute',
					top: '100%',
					zIndex: '9999'
				}}
			>
				<Picker
					theme='dark'
					emojiStyle='native'
					onEmojiClick={selectEmoji}
				/>
			</Box>
		</Box>
	);
};

export default EmojiPicker;
