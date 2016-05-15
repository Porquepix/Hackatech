-- Trigger to check if the limit of participant is reached
-- If it is, the registration is impossible

CREATE OR REPLACE FUNCTION pc_check_max_participants_per_team() RETURNS trigger AS $$
DECLARE 
    v_ParticipantPTCount INTEGER;
    v_MaxParticipantPTCount INTEGER;
BEGIN
    SELECT h.max_participant_per_team INTO v_MaxParticipantPTCount
    FROM hackathons h, projects p
    WHERE p.id = NEW.project_id
        AND h.id = p.hackathon_id;

    SELECT COUNT(1) INTO v_ParticipantPTCount
    FROM join 
    WHERE project_id = NEW.project_id;
    -- Add one to count the admin
    v_ParticipantPTCount := v_ParticipantPTCount + 1;

    IF v_ParticipantPTCount >= v_MaxParticipantPTCount THEN
        RAISE EXCEPTION 'This team is already full !';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_check_max_participants_per_team ON join;

CREATE TRIGGER tg_check_max_participants_per_team 
BEFORE INSERT ON join
FOR EACH ROW
EXECUTE PROCEDURE pc_check_max_participants_per_team();
