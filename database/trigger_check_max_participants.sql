-- Trigger to check if the limit of participant is reached
-- If it is, the registration is impossible

CREATE OR REPLACE FUNCTION pc_check_max_participants() RETURNS trigger AS $$
DECLARE 
    v_ParticipantCount INTEGER;
    v_MaxParticipantCount INTEGER;
BEGIN
    SELECT max_participant INTO v_MaxParticipantCount
    FROM hackathons
    WHERE id = NEW.hackathon_id;

    SELECT COUNT(1) INTO v_ParticipantCount
    FROM participate 
    WHERE hackathon_id = NEW.hackathon_id;

    IF v_ParticipantCount >= v_MaxParticipantCount THEN
        RAISE EXCEPTION 'Too many participants !';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_check_max_participants  ON participate;

CREATE TRIGGER tg_check_max_participants 
BEFORE INSERT ON participate
FOR EACH ROW
EXECUTE PROCEDURE pc_check_max_participants();
