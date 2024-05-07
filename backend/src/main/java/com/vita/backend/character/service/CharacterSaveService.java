package com.vita.backend.character.service;

import com.vita.backend.character.data.request.CharacterGameSingleSaveRequest;
import com.vita.backend.character.data.request.CharacterSaveRequest;
import com.vita.backend.character.domain.enumeration.GameType;

public interface CharacterSaveService {
	void characterGameSingleSave(long memberId, long characterId, GameType type,
		CharacterGameSingleSaveRequest request);
	void characterSave(long memberId, CharacterSaveRequest request);
	void characterVitaUpdate();
}
